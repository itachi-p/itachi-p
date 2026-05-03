#!/usr/bin/env python3
"""仮説検証タイマー - システム全体のアイドル検知対応スタンドアロンアプリ"""

import tkinter as tk
from tkinter import messagebox
import json
import time
import subprocess
import re
import csv
from datetime import datetime
from pathlib import Path

DATA_DIR = Path.home() / '.hypothesis-timer'
DATA_FILE = DATA_DIR / 'sessions.json'
SETTINGS_FILE = DATA_DIR / 'settings.json'

BG = '#0f1117'
BG2 = '#1e293b'
BG3 = '#334155'
FG = '#f1f5f9'
FG2 = '#94a3b8'
FG3 = '#475569'
GREEN = '#22c55e'
AMBER = '#f59e0b'
RED = '#ef4444'


def ensure_data_dir():
    DATA_DIR.mkdir(exist_ok=True)


def get_system_idle_seconds():
    """ioreg経由でシステム全体の入力アイドル時間を取得"""
    try:
        output = subprocess.check_output(
            ['ioreg', '-c', 'IOHIDSystem'],
            text=True, stderr=subprocess.DEVNULL, timeout=2
        )
        match = re.search(r'"HIDIdleTime"\s*=\s*(\d+)', output)
        if match:
            return int(match.group(1)) / 1_000_000_000
    except Exception:
        pass
    return 0


def load_sessions():
    if DATA_FILE.exists():
        try:
            return json.loads(DATA_FILE.read_text())
        except Exception:
            pass
    return []


def save_sessions(sessions):
    DATA_FILE.write_text(json.dumps(sessions, ensure_ascii=False, indent=2))


def load_settings():
    if SETTINGS_FILE.exists():
        try:
            return json.loads(SETTINGS_FILE.read_text())
        except Exception:
            pass
    return {'idle_timeout': 15}


def save_settings(settings):
    SETTINGS_FILE.write_text(json.dumps(settings, ensure_ascii=False))


def fmt(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f'{h:02d}:{m:02d}:{s:02d}'


class TimerApp:
    def __init__(self):
        ensure_data_dir()
        self.settings = load_settings()
        self.sessions = load_sessions()

        self.is_running = False
        self.is_paused = False
        self.session_start = None
        self.elapsed_before_pause = 0.0
        self.was_idle_paused = False
        self._idle_tick = 0

        self.compact = True
        self._drag_x = 0
        self._drag_y = 0

        self.root = tk.Tk()
        self.root.title('仮説検証タイマー')
        self.root.wm_attributes('-topmost', True)
        self.root.configure(bg=BG)
        self.root.resizable(False, False)
        self.root.geometry('300x105+100+100')

        self._build()
        self._refresh_history()
        self._tick()
        self.root.mainloop()

    # ── UI構築 ────────────────────────────────────────────────

    def _build(self):
        # コンパクト部分（常時表示）
        self.compact_frame = tk.Frame(self.root, bg=BG, padx=10, pady=6)
        self.compact_frame.pack(fill='x')
        self._bind_drag(self.compact_frame)

        # 1行目: タイマー + 展開ボタン
        row1 = tk.Frame(self.compact_frame, bg=BG)
        row1.pack(fill='x')
        self._bind_drag(row1)

        self.timer_lbl = tk.Label(row1, text='00:00:00',
                                   font=('Courier', 30, 'bold'),
                                   fg=FG, bg=BG)
        self.timer_lbl.pack(side='left')
        self._bind_drag(self.timer_lbl)

        self.toggle_btn = tk.Button(row1, text='▾', font=('Helvetica', 13),
                                     fg=FG3, bg=BG, relief='flat', bd=0,
                                     activebackground=BG, activeforeground=FG2,
                                     cursor='hand2', command=self._toggle_compact)
        self.toggle_btn.pack(side='right', padx=2)

        # 2行目: ステータス + 累積
        row2 = tk.Frame(self.compact_frame, bg=BG)
        row2.pack(fill='x')
        self._bind_drag(row2)

        self.status_lbl = tk.Label(row2, text='待機中',
                                    font=('Helvetica', 9), fg=FG3, bg=BG)
        self.status_lbl.pack(side='left')

        self.total_lbl = tk.Label(row2, text='累積: 00:00:00',
                                   font=('Courier', 9), fg=FG3, bg=BG)
        self.total_lbl.pack(side='right')

        # 3行目: ボタン群（1列）
        row3 = tk.Frame(self.compact_frame, bg=BG)
        row3.pack(fill='x', pady=(4, 0))

        LGREEN = '#86efac'
        LDARK  = '#14532d'
        BLUE   = '#2563eb'
        BTN_FONT = ('Helvetica', 11)

        self.btn_start = self._btn(row3, '▶ 開始', LGREEN, LDARK, self._start, font=BTN_FONT)
        self.btn_start.pack(side='left', padx=(0, 2))

        self.btn_pause = self._btn(row3, '⏸', LGREEN, LDARK, self._toggle_pause, font=BTN_FONT)
        self.btn_pause.pack(side='left', padx=(0, 2))
        self.btn_pause.config(state='disabled')

        self.btn_finish = self._btn(row3, '⏹ 停止', LGREEN, LDARK, self._finish, font=BTN_FONT)
        self.btn_finish.pack(side='left', padx=(0, 2))
        self.btn_finish.config(state='disabled')

        self.btn_copy = self._btn(row3, '⎘', BLUE, '#fff', self._copy, font=('Helvetica', 16), padx=6, pady=0)
        self.btn_copy.pack(side='left')

        # 展開部分（折り畳み）
        self.expand_frame = tk.Frame(self.root, bg=BG)

        # メモ入力
        note_wrap = tk.Frame(self.expand_frame, bg=BG, padx=10, pady=4)
        note_wrap.pack(fill='x')

        self.note_entry = tk.Entry(note_wrap, font=('Helvetica', 11),
                                    bg=BG2, fg=FG2, insertbackground=FG2,
                                    relief='flat', bd=4)
        self.note_entry.pack(fill='x')
        self.note_entry.insert(0, 'メモ（仮説名など）...')
        self.note_entry.bind('<FocusIn>', self._note_focus_in)
        self.note_entry.bind('<FocusOut>', self._note_focus_out)
        self._note_placeholder = True

        # 設定行
        cfg_row = tk.Frame(self.expand_frame, bg=BG, padx=10, pady=2)
        cfg_row.pack(fill='x')

        tk.Label(cfg_row, text='アイドル停止:',
                 font=('Helvetica', 10), fg=FG3, bg=BG).pack(side='left')

        self.timeout_var = tk.StringVar(value=str(self.settings.get('idle_timeout', 15)))
        timeout_entry = tk.Entry(cfg_row, textvariable=self.timeout_var,
                                  font=('Helvetica', 10), width=4,
                                  bg=BG2, fg=FG, insertbackground=FG2,
                                  relief='flat', bd=4, justify='center')
        timeout_entry.pack(side='left', padx=4)
        timeout_entry.bind('<FocusOut>', self._save_timeout)
        timeout_entry.bind('<Return>', self._save_timeout)

        tk.Label(cfg_row, text='分', font=('Helvetica', 10), fg=FG3, bg=BG).pack(side='left')

        self._btn(cfg_row, 'CSV', BG2, FG3, self._export_csv,
                  font=('Helvetica', 9), padx=6).pack(side='right', padx=(4, 0))
        self._btn(cfg_row, 'クリア', BG2, RED, self._clear,
                  font=('Helvetica', 9), padx=6).pack(side='right')

        # 履歴
        sep = tk.Frame(self.expand_frame, bg=BG, padx=10)
        sep.pack(fill='x')
        tk.Label(sep, text='── セッション履歴 ──',
                 font=('Helvetica', 9), fg=BG3, bg=BG).pack()

        hist_wrap = tk.Frame(self.expand_frame, bg=BG, padx=10, pady=4)
        hist_wrap.pack(fill='both', expand=True)

        sb = tk.Scrollbar(hist_wrap)
        sb.pack(side='right', fill='y')

        self.history_txt = tk.Text(hist_wrap, height=8,
                                    font=('Courier', 9),
                                    bg=BG2, fg=FG2, relief='flat', bd=0,
                                    wrap='none', state='disabled', cursor='arrow',
                                    yscrollcommand=sb.set)
        self.history_txt.pack(fill='both', expand=True)
        sb.config(command=self.history_txt.yview)

    def _btn(self, parent, text, bg, fg, cmd, font=('Helvetica', 10), padx=8, pady=3):
        return tk.Button(parent, text=text, font=font,
                         fg=fg, bg=bg, relief='flat', bd=0,
                         activebackground=bg, activeforeground=fg,
                         cursor='hand2', command=cmd, padx=padx, pady=pady)

    def _bind_drag(self, widget):
        widget.bind('<Button-1>', self._drag_start)
        widget.bind('<B1-Motion>', self._drag_motion)

    def _drag_start(self, e):
        self._drag_x = e.x_root - self.root.winfo_x()
        self._drag_y = e.y_root - self.root.winfo_y()

    def _drag_motion(self, e):
        self.root.geometry(f'+{e.x_root - self._drag_x}+{e.y_root - self._drag_y}')

    # ── コンパクト切り替え ────────────────────────────────────

    def _toggle_compact(self):
        self.compact = not self.compact
        if self.compact:
            self.expand_frame.pack_forget()
            self.toggle_btn.config(text='▾')
            self.root.geometry('300x105')
        else:
            self.expand_frame.pack(fill='both', expand=True)
            self.toggle_btn.config(text='▴')
            self.root.geometry('300x440')

    # ── メモ ────────────────────────────────────────────────

    def _note_focus_in(self, _e):
        if self._note_placeholder:
            self.note_entry.delete(0, 'end')
            self.note_entry.config(fg=FG)
            self._note_placeholder = False

    def _note_focus_out(self, _e):
        if not self.note_entry.get().strip():
            self.note_entry.insert(0, 'メモ（仮説名など）...')
            self.note_entry.config(fg=FG2)
            self._note_placeholder = True

    def _get_note(self):
        if self._note_placeholder:
            return ''
        return self.note_entry.get().strip()

    def _clear_note(self):
        self.note_entry.delete(0, 'end')
        self.note_entry.insert(0, 'メモ（仮説名など）...')
        self.note_entry.config(fg=FG2)
        self._note_placeholder = True

    # ── タイマー操作 ────────────────────────────────────────

    def _start(self):
        self.is_running = True
        self.is_paused = False
        self.was_idle_paused = False
        self.session_start = time.time()
        self.elapsed_before_pause = 0.0
        self.btn_start.config(state='disabled')
        self.btn_pause.config(state='normal', text='⏸')
        self.btn_finish.config(state='normal')
        self._set_status('計測中', GREEN)
        self.timer_lbl.config(fg=FG)

    def _toggle_pause(self):
        if not self.is_running:
            return
        if self.is_paused:
            self._resume()
        else:
            self._pause()

    def _pause(self, from_idle=False):
        if self.is_paused:
            return
        self.is_paused = True
        self.was_idle_paused = from_idle
        self.elapsed_before_pause += time.time() - self.session_start
        self.session_start = None
        self.btn_pause.config(text='▶')
        color = AMBER if from_idle else FG3
        self._set_status('アイドル停止' if from_idle else '一時停止中', color)
        self.timer_lbl.config(fg=color)

    def _resume(self, from_idle=False):
        if not self.is_paused:
            return
        self.is_paused = False
        self.was_idle_paused = False
        self.session_start = time.time()
        self.btn_pause.config(text='⏸')
        self._set_status('計測中', GREEN)
        self.timer_lbl.config(fg=FG)

    def _finish(self):
        elapsed = self._current_elapsed()
        self.sessions.insert(0, {
            'timestamp': datetime.now().isoformat(),
            'duration': elapsed,
            'note': self._get_note()
        })
        save_sessions(self.sessions)

        self.is_running = False
        self.is_paused = False
        self.elapsed_before_pause = 0.0
        self.session_start = None
        self.btn_start.config(state='normal')
        self.btn_pause.config(state='disabled', text='⏸')
        self.btn_finish.config(state='disabled')
        self.timer_lbl.config(text='00:00:00', fg=FG)
        self._set_status('待機中', FG3)
        self._clear_note()
        self._refresh_history()
        self.total_lbl.config(text=f'累積: {fmt(self._total_elapsed())}')

    def _set_status(self, text, color):
        self.status_lbl.config(text=text, fg=color)

    # ── コピー ────────────────────────────────────────────────

    def _copy(self):
        elapsed = self._current_elapsed()
        total = self._total_elapsed()
        note = self._get_note()
        note_part = f' | {note}' if note else ''
        text = f'⏱ タスク時間: {fmt(elapsed)} | 累積: {fmt(total)}{note_part}'
        self.root.clipboard_clear()
        self.root.clipboard_append(text)
        orig = self.btn_copy.cget('text')
        self.btn_copy.config(text='✓ コピー済')
        self.root.after(1800, lambda: self.btn_copy.config(text=orig))

    # ── 時間計算 ────────────────────────────────────────────

    def _current_elapsed(self):
        if not self.is_running:
            return 0.0
        if self.is_paused:
            return self.elapsed_before_pause
        return self.elapsed_before_pause + (time.time() - self.session_start)

    def _total_elapsed(self):
        return sum(s['duration'] for s in self.sessions) + self._current_elapsed()

    # ── 履歴 ────────────────────────────────────────────────

    def _refresh_history(self):
        try:
            self.history_txt.config(state='normal')
            self.history_txt.delete('1.0', 'end')
            if not self.sessions:
                self.history_txt.insert('end', '  （記録なし）')
            else:
                for s in self.sessions[:30]:
                    dt = datetime.fromisoformat(s['timestamp'])
                    line = f"  {dt.strftime('%m/%d %H:%M')}  {fmt(s['duration'])}"
                    note = s.get('note', '')
                    if note:
                        line += f'  {note}'
                    self.history_txt.insert('end', line + '\n')
            self.history_txt.config(state='disabled')
        except Exception:
            pass

    def _export_csv(self):
        if not self.sessions:
            return
        out = DATA_DIR / f'timer-{datetime.now().strftime("%Y%m%d-%H%M")}.csv'
        with open(out, 'w', newline='', encoding='utf-8-sig') as f:
            w = csv.writer(f)
            w.writerow(['日時', '秒数', 'メモ'])
            for s in self.sessions:
                w.writerow([s['timestamp'], int(s['duration']), s.get('note', '')])
        self._set_status(f'保存: {out.name}', GREEN)
        self.root.after(3000, lambda: self._set_status(
            '計測中' if (self.is_running and not self.is_paused) else '待機中', FG3))

    def _clear(self):
        if not messagebox.askyesno('確認', '履歴をすべて削除しますか？'):
            return
        self.sessions = []
        save_sessions(self.sessions)
        self._refresh_history()
        self.total_lbl.config(text='累積: 00:00:00')

    def _save_timeout(self, _e=None):
        try:
            self.settings['idle_timeout'] = int(self.timeout_var.get())
            save_settings(self.settings)
        except ValueError:
            pass

    # ── メインループ ────────────────────────────────────────

    def _tick(self):
        if self.is_running:
            self.timer_lbl.config(text=fmt(self._current_elapsed()))
            self.total_lbl.config(text=f'累積: {fmt(self._total_elapsed())}')

            # ioreg呼び出しは10秒ごと（軽量化）
            self._idle_tick += 1
            if self._idle_tick >= 10:
                self._idle_tick = 0
                idle = get_system_idle_seconds()
                timeout = self.settings.get('idle_timeout', 15) * 60

                if not self.is_paused and idle >= timeout:
                    self._pause(from_idle=True)
                elif self.is_paused and self.was_idle_paused and idle < 5:
                    self._resume(from_idle=True)

        self.root.after(1000, self._tick)


if __name__ == '__main__':
    TimerApp()
