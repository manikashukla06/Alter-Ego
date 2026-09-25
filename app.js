// ALTER — Main Application Engine & Database State Manager

const STORAGE_KEY = 'ALTER_IDENTITY_DATABASE_V1';

const defaultData = {
    user: { id: 'usr_01', name: 'Utkarsh', email: 'utkarsh@example.com' },
    alterEgo: {
        id: 'ego_01',
        name: 'VERA',
        description: 'Calm. Disciplined. Fearless.',
        traits: ['Discipline', 'Confidence', 'Curiosity', 'Focus'],
        rules: [
            'Never negotiate with procrastination',
            'Speak even when nervous',
            'Finish what you start'
        ],
        createdAt: 'September 2026'
    },
    habits: [
        { id: 'h1', title: 'Study 2 hours full-stack architecture', completed: true },
        { id: 'h2', title: 'Morning exercise & physical conditioning', completed: true },
        { id: 'h3', title: 'Read 20 pages of technical documentation', completed: false },
        { id: 'h4', title: 'No social media scrolling before 10 AM', completed: false }
    ],
    goals: [
        { id: 'g1', title: 'Build consistency in daily coding', completed: false },
        { id: 'g2', title: 'Master full-stack Next.js & Prisma', completed: false },
        { id: 'g3', title: 'Stop seeking external approval', completed: true }
    ],
    reflections: [
        {
            id: 'ref_01',
            intention: 'Study for 3 hours and complete API routes',
            action: 'Studied for 2 hours and finished habit controller',
            obstacle: 'Started late in afternoon and got distracted by phone notifications',
            date: 'Yesterday'
        }
    ],
    mode: 'DISCIPLINED'
};

let dbState = {};

function loadDatabase() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try { dbState = JSON.parse(raw); } catch (e) { dbState = defaultData; }
    } else {
        dbState = defaultData;
        saveDatabase();
    }
}

function saveDatabase() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbState));
    refreshUI();
}

function navigateTo(screenId) {
    document.querySelectorAll('.screen-view').forEach(s => {
        s.classList.remove('active-screen');
        s.classList.add('hidden');
    });

    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
        target.classList.remove('hidden');
        setTimeout(() => target.classList.add('active-screen'), 10);
    }

    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.getAttribute('data-target') === screenId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function refreshUI() {
    const ego = dbState.alterEgo;
    const nav = document.getElementById('mainNav');
    const navCreateBtn = document.getElementById('navCreateBtn');

    if (ego && ego.name) {
        if (nav) nav.classList.remove('hidden');
        if (navCreateBtn) navCreateBtn.innerText = 'Edit Ego';
    } else {
        if (nav) nav.classList.add('hidden');
        if (navCreateBtn) navCreateBtn.innerText = 'Create Alter Ego';
    }

    if (ego) {
        document.getElementById('dashName').innerText = ego.name;
        document.getElementById('dashDescription').innerText = `"${ego.description}"`;
        document.getElementById('profileName').innerText = ego.name;
        document.getElementById('profileCreatedDate').innerText = ego.createdAt || 'September 2026';

        const totalHabits = dbState.habits.length;
        const completedCount = dbState.habits.filter(h => h.completed).length;
        const consistency = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
        document.getElementById('dashConsistency').innerText = `${consistency}%`;

        renderHabits();

        const rulesContainer = document.getElementById('dashRules');
        if (rulesContainer) {
            rulesContainer.innerHTML = (ego.rules || []).map(r => `
                <li class="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2">
                    <span class="text-amber-400">❖</span> ${r}
                </li>
            `).join('');
        }

        renderTraitsProgress();
        renderGoals();
        renderReflectionLog();
    }
}

function renderHabits() {
    const container = document.getElementById('habitsList');
    if (!container) return;

    container.innerHTML = dbState.habits.map(h => `
        <div class="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group">
            <label class="flex items-center gap-3 cursor-pointer flex-1">
                <input type="checkbox" ${h.completed ? 'checked' : ''} onchange="toggleHabit('${h.id}')" class="w-5 h-5 rounded accent-emerald-500 cursor-pointer">
                <span class="text-xs font-mono ${h.completed ? 'line-through text-gray-500' : 'text-gray-200'}">
                    ${h.completed ? '✓' : '○'} ${h.title}
                </span>
            </label>
            <button onclick="deleteHabit('${h.id}')" class="opacity-0 group-hover:opacity-100 text-xs text-gray-500 hover:text-rose-400 transition">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function toggleHabit(id) {
    const target = dbState.habits.find(h => h.id === id);
    if (target) {
        target.completed = !target.completed;
        saveDatabase();
    }
}

function promptAddHabit() {
    const title = prompt("Enter new habit to track for your Alter Ego:");
    if (title && title.trim()) {
        dbState.habits.push({ id: 'h_' + Date.now(), title: title.trim(), completed: false });
        saveDatabase();
    }
}

function deleteHabit(id) {
    dbState.habits = dbState.habits.filter(h => h.id !== id);
    saveDatabase();
}

function renderTraitsProgress() {
    const container = document.getElementById('traitsProgressContainer');
    if (!container) return;

    const traitValues = { 'Discipline': 87, 'Confidence': 72, 'Curiosity': 91, 'Focus': 80, 'Resilience': 85 };
    const traits = dbState.alterEgo.traits || ['Discipline', 'Confidence', 'Curiosity'];

    container.innerHTML = traits.map(t => {
        const val = traitValues[t] || 75;
        return `
            <div>
                <div class="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span class="text-gray-300 font-bold uppercase">${t}</span>
                    <span class="text-amber-400">${val}%</span>
                </div>
                <div class="h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-1000" style="width: ${val}%;"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderGoals() {
    const container = document.getElementById('goalsList');
    if (!container) return;

    container.innerHTML = dbState.goals.map((g, idx) => `
        <div class="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group">
            <div class="flex items-center gap-3">
                <span class="text-xs font-mono text-amber-400">0${idx + 1}</span>
                <span class="text-xs font-mono ${g.completed ? 'line-through text-gray-500' : 'text-gray-200'}">${g.title}</span>
            </div>
            <button onclick="toggleGoal('${g.id}')" class="text-xs text-gray-400 hover:text-emerald-400">
                <i class="fa-solid ${g.completed ? 'fa-circle-check text-emerald-400' : 'fa-circle'}"></i>
            </button>
        </div>
    `).join('');
}

function toggleGoal(id) {
    const target = dbState.goals.find(g => g.id === id);
    if (target) {
        target.completed = !target.completed;
        saveDatabase();
    }
}

function promptAddGoal() {
    const title = prompt("Enter new primary goal:");
    if (title && title.trim()) {
        dbState.goals.push({ id: 'g_' + Date.now(), title: title.trim(), completed: false });
        saveDatabase();
    }
}

function handleMirrorSubmit(e) {
    e.preventDefault();
    const intention = document.getElementById('mirrorIntention').value.trim();
    const action = document.getElementById('mirrorAction').value.trim();
    const obstacle = document.getElementById('mirrorObstacle').value.trim();

    if (!intention || !action || !obstacle) return;

    dbState.reflections.unshift({
        id: 'ref_' + Date.now(),
        intention,
        action,
        obstacle,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    saveDatabase();
    e.target.reset();
    alert("✨ Mirror reflection saved!");
}

function renderReflectionLog() {
    const container = document.getElementById('reflectionLog');
    if (!container) return;

    container.innerHTML = dbState.reflections.map(r => `
        <div class="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 font-mono text-xs">
            <div class="flex justify-between items-center text-[10px] text-amber-400 border-b border-white/10 pb-2">
                <span>EVALUATION LOG</span>
                <span>${r.date}</span>
            </div>
            <div>
                <span class="text-gray-400 uppercase tracking-widest block text-[10px]">INTENTION</span>
                <p class="text-gray-200 mt-0.5">${r.intention}</p>
            </div>
            <div>
                <span class="text-gray-400 uppercase tracking-widest block text-[10px]">REAL EXECUTION</span>
                <p class="text-emerald-400 mt-0.5">${r.action}</p>
            </div>
            <div>
                <span class="text-gray-400 uppercase tracking-widest block text-[10px]">OBSTACLE / FRICTION</span>
                <p class="text-amber-300 italic mt-0.5">${r.obstacle}</p>
            </div>
        </div>
    `).join('');
}

function toggleTrait(btn, traitName) {
    const currentTraits = dbState.alterEgo.traits || [];
    if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        dbState.alterEgo.traits = currentTraits.filter(t => t !== traitName);
    } else {
        if (currentTraits.length >= 4) { alert("Max 4 core traits allowed."); return; }
        btn.classList.add('selected');
        dbState.alterEgo.traits.push(traitName);
    }
}

function addRuleInput() {
    const container = document.getElementById('rulesList');
    const div = document.createElement('div');
    div.className = 'flex gap-2';
    div.innerHTML = `<input type="text" class="rule-input w-full bg-[#070709] border border-alterBorder rounded-xl px-4 py-3 text-xs text-white font-mono" placeholder="Enter non-negotiable rule">`;
    container.appendChild(div);
}

function handleCreateAlterEgo(e) {
    e.preventDefault();
    const name = document.getElementById('egoName').value.trim();
    const description = document.getElementById('egoDescription').value.trim();
    const goal = document.getElementById('egoGoal').value.trim();
    const rules = Array.from(document.querySelectorAll('.rule-input')).map(i => i.value.trim()).filter(Boolean);

    dbState.alterEgo = {
        id: 'ego_' + Date.now(),
        name,
        description,
        traits: dbState.alterEgo.traits.length > 0 ? dbState.alterEgo.traits : ['Discipline', 'Confidence', 'Focus'],
        rules,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    if (goal) dbState.goals.unshift({ id: 'g_' + Date.now(), title: goal, completed: false });

    saveDatabase();
    navigateTo('dashboard');
}

function triggerEnterMode() {
    const overlay = document.getElementById('modeOverlay');
    overlay.classList.remove('pointer-events-none', 'opacity-0');
    overlay.classList.add('opacity-100');

    setTimeout(() => {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('pointer-events-none', 'opacity-0');
        dbState.mode = dbState.mode === 'DISCIPLINED' ? 'HYPER FOCUS' : 'DISCIPLINED';
        document.getElementById('currentModeLabel').innerText = dbState.mode;
        saveDatabase();
    }, 2200);
}

function exportData() {
    const jsonStr = JSON.stringify(dbState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alter_ego_database_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function resetData() {
    if (confirm("Reset database to defaults?")) {
        localStorage.removeItem(STORAGE_KEY);
        dbState = defaultData;
        saveDatabase();
        navigateTo('landing');
    }
}

function toggleDbModal() {
    document.getElementById('dbModal').classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
    refreshUI();
});
