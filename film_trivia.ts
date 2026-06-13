
// ============== PARADIGM: OBJECT-ORIENTED PROGRAMMING — TypeScript ==============
// TypeScript adds static typing (interfaces, access modifiers, and type annotations) 
// on top of JavaScript classes. Encapsulation: all quiz state lives inside the class.
// Abstraction: public API is just select(), next(), and restart().

interface TriviaQuestion {
    id:       number;
    question: string;
    options:  string[];
    correct:  number;   // 0-based index of the correct option
    fact:     string;   // fact shown after answering
}

class FilmTrivia {

    // Private state (encapsulation)
    private questions:    TriviaQuestion[];
    private currentIndex: number  = 0;
    private score:        number  = 0;
    private answered:     boolean = false;
    private container:    HTMLElement;

    constructor(questions: TriviaQuestion[], containerId: string) {
        this.questions = questions;
        const el = document.getElementById(containerId);
        if (!el) throw new Error(`Container #${containerId} not found`);
        this.container = el;
        this.render();
    }

    // Private computed helpers

    private get current(): TriviaQuestion {
        return this.questions[this.currentIndex];
    }

    private get progressLabel(): string {
        return `${this.currentIndex + 1} / ${this.questions.length}`;
    }

    private get progressPct(): number {
        return (this.currentIndex / this.questions.length) * 100;
    }

    // render() — builds the question card declaratively.
    //   Uses template literals to describe what the UI should
    //   look like from the current state (no manual DOM edits).
    render(): void {
        if (this.currentIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const q = this.current;

        // Map each option to a button (functional style inside OOP method)
        const optionsHtml: string = q.options.map((opt: string, i: number) => `
            <button
                id="opt-${i}"
                onclick="triviaApp.select(${i})"
                style="display:block; width:100%; text-align:left; padding:10px 16px;
                       margin:6px 0; border-radius:10px; border:2px solid #ddd;
                       background:white; cursor:pointer; font-size:0.95rem;
                       transition: background 0.25s, border-color 0.25s, transform 0.15s;
                       color:#333;"
                onmouseover="if(!this.disabled) this.style.borderColor='var(--primary-color)'"
                onmouseout="if(!this.disabled) this.style.borderColor='#ddd'">
                <span style="font-weight:bold; margin-right:8px; color:var(--primary-color);">
                    ${String.fromCharCode(65 + i)}.
                </span>${opt}
            </button>
        `).join('');

        this.container.innerHTML = `
            <div style="max-width:700px; margin:0 auto; font-family:inherit; padding: 10px 0;">

                <!-- Header: label + score -->
                <div style="display:flex; justify-content:space-between; align-items:center;
                            margin-bottom:14px;">
                    <span style="font-size:0.88rem; color:#999; letter-spacing:1px;">
                        🎬 PUERTO RICO FILM TRIVIA
                    </span>
                    <span style="font-size:0.88rem; color:#999;">
                        ${this.progressLabel} &nbsp;·&nbsp;
                        Score: <strong style="color:var(--primary-color)">${this.score}</strong>
                    </span>
                </div>

                <!-- Progress bar -->
                <div style="background:rgba(0,0,0,0.08); border-radius:99px;
                            height:5px; margin-bottom:22px;">
                    <div style="background:var(--primary-color); height:100%;
                                border-radius:99px; width:${this.progressPct}%;
                                transition:width 0.4s ease;"></div>
                </div>

                <!-- Question -->
                <h3 style="margin:0 0 20px 0; font-size:1.1rem; line-height:1.5;">
                    ${q.question}
                </h3>

                <!-- Options -->
                <div id="options-container">${optionsHtml}</div>

                <!-- Feedback area (hidden until answered) -->
                <div id="feedback" style="margin-top:16px; min-height:52px;"></div>

                <!-- Next button (hidden until answered) -->
                <button
                    id="next-btn"
                    onclick="triviaApp.next()"
                    style="display:none; margin-top:14px; padding:10px 30px;
                           border-radius:25px; background:var(--primary-color);
                           color:#fff; border:none; cursor:pointer;
                           font-size:1rem; font-weight:bold;
                           box-shadow:0 4px 10px rgba(0,0,0,0.2);
                           transition:transform 0.2s, box-shadow 0.2s;"
                    onmouseover="this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.transform='translateY(0)'">
                    ${this.currentIndex + 1 < this.questions.length ? 'Next →' : 'See Results 🏆'}
                </button>
            </div>
        `;

        this.answered = false;
    }

    // select(index) — called by onclick; checks the answer,
    // colors the buttons, and reveals the fact + Next button.
    select(index: number): void {
        if (this.answered) return;   // guard: ignore double-clicks
        this.answered = true;

        const isCorrect: boolean = index === this.current.correct;
        if (isCorrect) this.score++;

        // Color all buttons to reveal correct / wrong
        this.current.options.forEach((_: string, i: number) => {
            const btn = document.getElementById(`opt-${i}`) as HTMLButtonElement;
            if (!btn) return;
            btn.disabled = true;
            btn.style.cursor = 'default';

            if (i === this.current.correct) {
                btn.style.background   = '#d4edda';
                btn.style.borderColor  = '#28a745';
                btn.style.color        = '#155724';
            } else if (i === index) {
                btn.style.background   = '#f8d7da';
                btn.style.borderColor  = '#dc3545';
                btn.style.color        = '#721c24';
            }
        });

        // Feedback box
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.innerHTML = `
                <div style="padding:12px 16px; border-radius:10px; font-size:0.9rem;
                            background:${isCorrect ? '#d4edda' : '#f8d7da'};
                            color:${isCorrect ? '#155724' : '#721c24'};
                            border-left:4px solid ${isCorrect ? '#28a745' : '#dc3545'};">
                    ${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}
                    <br><em style="opacity:0.85;">${this.current.fact}</em>
                </div>
            `;
        }

        // Show Next / See Results button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) nextBtn.style.display = 'inline-block';
    }

    // next() — advance to the next question
    next(): void {
        this.currentIndex++;
        this.render();
    }

    // showResults() — final screen with score + medal
    private showResults(): void {
        const total:   number = this.questions.length;
        const pct:     number = Math.round((this.score / total) * 100);
        const medal:   string = pct >= 80 ? '🏆' : pct >= 50 ? '🎬' : '🎞️';
        const message: string = pct >= 80
            ? 'Outstanding! You really know Puerto Rican cinema.'
            : pct >= 50
            ? 'Not bad! Keep exploring Puerto Rican film history.'
            : 'Keep watching — there\'s a lot of great cinema to discover.';

        this.container.innerHTML = `
            <div style="max-width:600px; margin:0 auto; text-align:center; padding:40px 20px;">
                <div style="font-size:5rem; margin-bottom:8px;">${medal}</div>
                <h2 style="margin:0 0 12px 0;">Quiz Complete!</h2>
                <p style="font-size:1.5rem; margin:0 0 8px 0;">
                    You scored <strong style="color:var(--primary-color);">${this.score} / ${total}</strong>
                    <span style="color:#999; font-size:1rem;">(${pct}%)</span>
                </p>
                <p style="color:#777; margin-bottom:28px;">${message}</p>

                <!-- Score breakdown bar -->
                <div style="background:#eee; border-radius:99px; height:10px;
                            margin:0 auto 28px auto; max-width:300px;">
                    <div style="background:var(--primary-color); height:100%;
                                border-radius:99px; width:${pct}%;
                                transition:width 0.6s ease;"></div>
                </div>

                <button
                    onclick="triviaApp.restart()"
                    style="padding:12px 36px; border-radius:25px;
                           background:var(--primary-color); color:#fff; border:none;
                           cursor:pointer; font-size:1rem; font-weight:bold;
                           box-shadow:0 4px 10px rgba(0,0,0,0.2);">
                    Play Again 🔄
                </button>
            </div>
        `;
    }

    // restart() — resets all state and re-renders question 1
    restart(): void {
        this.currentIndex = 0;
        this.score        = 0;
        this.answered     = false;
        this.render();
    }
}

// BOOTSTRAP — Async fetch (Asynchronous paradigm)
// Loads film_trivia.json at runtime so adding questions only
// requires editing the JSON file, not this TypeScript file.
// triviaApp is global so inline onclick handlers can reach it.

declare let triviaApp: FilmTrivia;

(async (): Promise<void> => {
    try {
        const res: Response            = await fetch('film_trivia.json');
        const questions: TriviaQuestion[] = await res.json();
        (window as any).triviaApp      = new FilmTrivia(questions, 'trivia-app');
    } catch (err) {
        const el = document.getElementById('trivia-app');
        if (el) el.innerHTML = `<p style="color:red;">⚠️ Could not load trivia questions.</p>`;
        console.error('FilmTrivia load error:', err);
    }
})();