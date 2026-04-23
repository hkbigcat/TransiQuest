import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import {
  Award,
  BookOpen,
  Bot,
  CircuitBoard,
  FlaskConical,
  Home,
  Menu,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import { type ComponentType, useMemo, useState } from 'react'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Progress } from './components/ui/progress'
import { Textarea } from './components/ui/textarea'

type Page = 'dashboard' | 'learn' | 'quiz' | 'lab' | 'sparky' | 'resources'
type Difficulty = 'easy' | 'medium' | 'hard'
type BadgeType = 'Switch Master' | 'Logic Lord' | 'Transistor Titan'

interface Profile {
  xp: number
  level: string
  streak: number
  badges: BadgeType[]
  completedLessons: number[]
  completedChallenges: string[]
  leaderboard: { name: string; score: number }[]
}

const navItems: { id: Page; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Home / Dashboard', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'quiz', label: 'Quiz Arena', icon: Trophy },
  { id: 'lab', label: 'Build Lab', icon: FlaskConical },
  { id: 'sparky', label: 'Ask Sparky', icon: Bot },
  { id: 'resources', label: 'Resources', icon: CircuitBoard },
]

const levels = ['Novice', 'Builder', 'Circuit Knight', 'Logic Ace', 'Titan']
const xpForLevel = [0, 120, 280, 500, 800]

const lessonTitles = [
  'What is a transistor and why it matters',
  'BJT basics: NPN and PNP',
  'MOSFET modes: enhancement and depletion',
  'Transistor as a switch',
  'Transistor as an amplifier',
  'Logic gate combos: NOT, AND, OR, NAND, NOR',
]

const quizBank = Array.from({ length: 27 }, (_, i) => ({
  question: `Q${i + 1}: ${i % 3 === 0 ? 'Which terminal controls transistor flow?' : i % 3 === 1 ? 'Best reason NAND dominates CPUs?' : 'When is MOSFET considered ON?'}`,
  choices: ['Gate/Base drive present', 'No voltage at all', 'Collector floating', 'Emitter disconnected'],
  answer: 0,
  difficulty: (i < 9 ? 'easy' : i < 18 ? 'medium' : 'hard') as Difficulty,
  explain:
    'Nice read. Control terminal voltage or current is the trigger. That tiny move drives big current magic.',
}))

const challengeTargets = [
  { id: 'not', title: 'Build a NOT gate (inverter)', needs: ['NPN', 'Resistor', 'Battery', 'Switch'] },
  { id: 'and', title: 'Build an AND gate', needs: ['NPN', 'NPN', 'Resistor', 'Battery', 'Switch'] },
  { id: 'or', title: 'Build an OR gate', needs: ['PNP', 'PNP', 'Resistor', 'Battery', 'Switch'] },
  { id: 'amp', title: 'Simple amplifier brighter LED', needs: ['NPN', 'LED', 'Resistor', 'Battery'] },
  { id: 'sensor', title: 'Create a light sensor switch', needs: ['NPN', 'LED', 'Resistor', 'Battery', 'Switch'] },
]

const starterProfile: Profile = {
  xp: 0,
  level: 'Novice',
  streak: 0,
  badges: [],
  completedLessons: [],
  completedChallenges: [],
  leaderboard: [],
}

function computeLevel(xp: number) {
  let idx = 0
  for (let i = xpForLevel.length - 1; i >= 0; i -= 1) {
    if (xp >= xpForLevel[i]) {
      idx = i
      break
    }
  }
  return levels[idx]
}

function saveProfile(profile: Profile) {
  localStorage.setItem('transiquest-profile', JSON.stringify(profile))
}

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [profile, setProfile] = useState<Profile>(() => {
    const raw = localStorage.getItem('transiquest-profile')
    return raw ? (JSON.parse(raw) as Profile) : starterProfile
  })
  const [lessonIdx, setLessonIdx] = useState(0)
  const [quizDifficulty, setQuizDifficulty] = useState<Difficulty>('easy')
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [buildBag, setBuildBag] = useState<string[]>([])
  const [dragItem, setDragItem] = useState('')
  const [challengeIdx, setChallengeIdx] = useState(0)
  const [challengeTries, setChallengeTries] = useState(0)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'bot',
      text: 'Yo, I am Sparky. Ask anything transistor, logic, MOSFET, BJT, real-world chips. Let us level up.',
    },
  ])
  const [selectedTerm, setSelectedTerm] = useState('Transistor')

  const currentLevel = computeLevel(profile.xp)
  const nextLevelXp = xpForLevel[Math.min(levels.indexOf(currentLevel) + 1, xpForLevel.length - 1)]
  const currentBaseXp = xpForLevel[Math.max(levels.indexOf(currentLevel), 0)]
  const progressPct = ((profile.xp - currentBaseXp) / Math.max(1, nextLevelXp - currentBaseXp)) * 100

  const filteredQuiz = useMemo(
    () => quizBank.filter((q) => q.difficulty === quizDifficulty),
    [quizDifficulty],
  )

  const triggerWin = () => confetti({ spread: 90, particleCount: 120, origin: { y: 0.7 } })

  const updateProfile = (next: Partial<Profile>) => {
    setProfile((prev) => {
      const merged = { ...prev, ...next, level: computeLevel(next.xp ?? prev.xp) }
      saveProfile(merged)
      return merged
    })
  }

  const awardXp = (amount: number) => {
    updateProfile({ xp: profile.xp + amount, streak: profile.streak + 1 })
  }

  const unlockBadge = (name: BadgeType) => {
    if (profile.badges.includes(name)) return
    updateProfile({ badges: [...profile.badges, name] })
  }

  const finishLesson = () => {
    if (!profile.completedLessons.includes(lessonIdx)) {
      awardXp(20)
      updateProfile({ completedLessons: [...profile.completedLessons, lessonIdx] })
      if (lessonIdx === 3) unlockBadge('Switch Master')
      if (profile.completedLessons.length >= 5 && profile.completedChallenges.length >= 5) {
        unlockBadge('Transistor Titan')
      }
    }
  }

  const answerQuiz = (choice: number) => {
    const current = filteredQuiz[quizIdx]
    if (choice === current.answer) {
      setQuizScore((s) => s + 1)
      setFeedback(`Epic combo. ${current.explain}`)
    } else {
      setFeedback(`Close one. ${current.explain}`)
      updateProfile({ streak: 0 })
    }
    if (quizIdx + 1 >= filteredQuiz.length) {
      const finalScore = choice === current.answer ? quizScore + 1 : quizScore
      const xpEarned = Math.round((finalScore / filteredQuiz.length) * 80)
      awardXp(xpEarned)
      setQuizDone(true)
      const updatedBoard = [...profile.leaderboard, { name: 'Player', score: finalScore }].sort(
        (a, b) => b.score - a.score,
      )
      updateProfile({ leaderboard: updatedBoard.slice(0, 5) })
      if (finalScore >= 7) unlockBadge('Logic Lord')
      triggerWin()
    } else {
      setQuizIdx((n) => n + 1)
    }
  }

  const runChallenge = () => {
    const target = challengeTargets[challengeIdx]
    const success = target.needs.every((n) => buildBag.includes(n))
    if (success) {
      const nextChallenges = profile.completedChallenges.includes(target.id)
        ? profile.completedChallenges
        : [...profile.completedChallenges, target.id]
      updateProfile({ completedChallenges: nextChallenges })
      awardXp(45)
      setFeedback('Power spike! Circuit passes. Current is flowing.')
      triggerWin()
    } else {
      setChallengeTries((t) => t + 1)
      setFeedback('Not yet. Add missing pieces and run again.')
      updateProfile({ streak: 0 })
    }
  }

  const askSparky = () => {
    if (!chatInput.trim()) return
    const lower = chatInput.toLowerCase()
    let reply =
      'Great question. Step 1: set the control signal. Step 2: observe current path. Step 3: map output state to logic 0 or 1.'
    if (lower.includes('mosfet')) {
      reply =
        'MOSFET is a voltage-controlled gate. Add enough gate voltage and boom, channel opens. That is your switch for phone chargers and gaming GPUs.'
    } else if (lower.includes('nand')) {
      reply =
        'NAND is the MVP gate. It builds every other gate, is compact on silicon, and gives CPU designers an efficiency win.'
    } else if (lower.includes('amplifier')) {
      reply =
        'Amplifier mode means tiny base or gate signal controls much larger collector or drain current. Small signal in, big power out.'
    }
    setChatHistory((h) => [...h, { role: 'user', text: chatInput }, { role: 'bot', text: reply }])
    setChatInput('')
  }

  const components = ['NPN', 'PNP', 'Resistor', 'LED', 'Wire', 'Battery', 'Switch']
  const targetChallenge = challengeTargets[challengeIdx]

  const glossary: Record<string, string> = {
    Transistor: 'A tiny semiconductor switch or amplifier powering every modern digital device.',
    BJT: 'Current-controlled transistor with Base, Collector, Emitter terminals.',
    MOSFET: 'Voltage-controlled transistor with Gate, Drain, Source. Fast and power efficient.',
    NAND: 'Logic gate output is 0 only when both inputs are 1.',
    Amplifier: 'Circuit that boosts the amplitude of a small signal.',
  }

  return (
    <div className="grid-circuit min-h-screen bg-bg text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(0,240,255,0.15),transparent_50%)]" />
      <aside
        className={`fixed left-0 top-0 z-30 h-full w-72 border-r border-neonBlue/20 bg-black/65 p-4 backdrop-blur transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-orbitron text-xl text-neonBlue">TransiQuest</h1>
          <button onClick={() => setMobileNav(false)} className="lg:hidden">
            <X />
          </button>
        </div>
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id)
                setMobileNav(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${activePage === item.id ? 'bg-neonBlue/20 text-neonBlue shadow-neon' : 'hover:bg-neonBlue/10'}`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="p-4 lg:ml-72 lg:p-8">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-neonBlue/30 bg-panel/80 p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(true)} className="lg:hidden">
              <Menu />
            </button>
            <div>
              <p className="font-orbitron text-lg text-neonBlue">Quest to Master Transistors</p>
              <p className="text-sm text-slate-300">This powers your phone, gaming PC, and TikTok.</p>
            </div>
          </div>
          <div className="w-44">
            <p className="mb-1 text-xs">Level {currentLevel}</p>
            <Progress value={progressPct} />
          </div>
        </div>

        {activePage === 'dashboard' && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h2 className="font-orbitron text-3xl text-neonBlue">TransiQuest: Become a Transistor Titan!</h2>
                  <p className="text-slate-300">
                    The tiny heroes inside every phone, computer, and game console.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setActivePage('learn')}>Start Learning</Button>
                    <Button variant="secondary" onClick={() => setActivePage('lab')}>
                      Jump to Build Lab
                    </Button>
                  </div>
                </div>
                <motion.svg
                  viewBox="0 0 280 170"
                  className="h-48 w-full rounded-2xl border border-neonBlue/30 bg-black/50 p-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                >
                  <rect x="95" y="40" width="90" height="85" rx="16" fill="#0f1a35" stroke="#00F0FF" />
                  <line x1="40" y1="82" x2="95" y2="82" stroke="#39FF14" strokeWidth="4" />
                  <line x1="185" y1="58" x2="240" y2="58" stroke="#00F0FF" strokeWidth="4" />
                  <line x1="185" y1="106" x2="240" y2="106" stroke="#00F0FF" strokeWidth="4" />
                  <circle cx="50" cy="82" r="6" fill="#39FF14">
                    <animate attributeName="cx" values="50;90;50" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="205" cy="58" r="5" fill="#00F0FF">
                    <animate attributeName="cy" values="58;106;58" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </motion.svg>
              </div>
            </Card>
            <div className="grid gap-4 md:grid-cols-4">
              <Card><p className="text-sm">Today XP</p><p className="text-2xl font-bold text-neonGreen">{profile.xp}</p></Card>
              <Card><p className="text-sm">Current level</p><p className="text-2xl font-bold text-neonBlue">{currentLevel}</p></Card>
              <Card><p className="text-sm">Streak</p><p className="text-2xl font-bold text-neonPurple">{profile.streak}</p></Card>
              <Card>
                <p className="mb-2 text-sm">Unlocked badges</p>
                <div className="flex flex-wrap gap-2">{profile.badges.map((b) => <Badge key={b}>{b}</Badge>)}</div>
              </Card>
            </div>
          </div>
        )}

        {activePage === 'learn' && (
          <Card className="space-y-4">
            <h2 className="font-orbitron text-2xl text-neonBlue">Learn Mode</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {lessonTitles.map((title, idx) => (
                <button key={title} onClick={() => setLessonIdx(idx)} className={`rounded-xl border p-3 text-left ${lessonIdx === idx ? 'border-neonBlue bg-neonBlue/10' : 'border-neonBlue/20'}`}>
                  <p className="text-sm">{idx + 1}. {title}</p>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-neonGreen/30 bg-black/35 p-4">
              <p className="mb-2 font-semibold text-neonGreen">{lessonTitles[lessonIdx]}</p>
              <p className="text-sm text-slate-300">Short version: control signal in, power decision out. Press test and watch the current path light up.</p>
              <div className="my-4 flex h-24 items-center rounded-xl bg-black/45 p-3">
                <div className="h-2 w-full animate-pulseLine rounded bg-gradient-to-r from-neonBlue via-neonGreen to-neonPurple" />
              </div>
              <Button onClick={finishLesson}>Test it yourself +20 XP</Button>
            </div>
          </Card>
        )}

        {activePage === 'quiz' && (
          <Card className="space-y-4">
            <h2 className="font-orbitron text-2xl text-neonBlue">Quiz Arena</h2>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <Button key={d} variant={quizDifficulty === d ? 'default' : 'secondary'} onClick={() => { setQuizDifficulty(d); setQuizIdx(0); setQuizScore(0); setQuizDone(false) }}>
                  {d}
                </Button>
              ))}
            </div>
            {!quizDone ? (
              <div className="space-y-3">
                <p>{filteredQuiz[quizIdx]?.question}</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {filteredQuiz[quizIdx]?.choices.map((c, i) => (
                    <Button key={c} variant="secondary" onClick={() => answerQuiz(i)}>{c}</Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl text-neonGreen">Score: {quizScore}/{filteredQuiz.length}</p>
                <p className="text-sm">Meme reaction: {quizScore > 6 ? 'Gigachad circuit wizard unlocked.' : 'Keep grinding, next run is your power spike.'}</p>
                <Button onClick={() => { setQuizIdx(0); setQuizScore(0); setQuizDone(false) }}>Retry</Button>
              </div>
            )}
            <p className="text-sm text-slate-300">{feedback}</p>
            <div>
              <p className="mb-2 text-sm">Local leaderboard</p>
              {profile.leaderboard.map((entry, i) => <p key={`${entry.name}-${i}`} className="text-sm">{i + 1}. {entry.name} - {entry.score}</p>)}
            </div>
          </Card>
        )}

        {activePage === 'lab' && (
          <Card className="space-y-4">
            <h2 className="font-orbitron text-2xl text-neonBlue">Build Lab</h2>
            <p className="text-sm text-slate-300">Challenge: {targetChallenge.title}</p>
            <div className="flex flex-wrap gap-2">
              {challengeTargets.map((c, idx) => (
                <Button key={c.id} variant={idx === challengeIdx ? 'default' : 'secondary'} onClick={() => setChallengeIdx(idx)}>
                  {c.id.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="bg-black/30">
                <p className="mb-2 text-sm">Components</p>
                <div className="flex flex-wrap gap-2">
                  {components.map((c) => (
                    <div key={c} draggable onDragStart={() => setDragItem(c)}>
                      <Button variant="secondary" onClick={() => setBuildBag((b) => [...b, c])}>
                        + {c}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="bg-black/30">
                <p className="mb-2 text-sm">Digital breadboard</p>
                <div
                  className="min-h-24 rounded-xl border border-dashed border-neonBlue/40 p-3"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (!dragItem) return
                    setBuildBag((b) => [...b, dragItem])
                    setDragItem('')
                  }}
                >
                  {buildBag.length ? buildBag.join(' | ') : 'Drop your parts here'}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button onClick={runChallenge}>Run</Button>
                  <Button variant="secondary" onClick={() => setBuildBag([])}>Clear</Button>
                </div>
                {challengeTries >= 3 && <p className="mt-2 text-xs text-neonGreen">Hint unlocked: {targetChallenge.needs.join(', ')}</p>}
              </Card>
            </div>
            <p className="text-sm">{feedback}</p>
          </Card>
        )}

        {activePage === 'sparky' && (
          <Card className="space-y-4">
            <h2 className="font-orbitron text-2xl text-neonBlue">Ask Sparky the Transistor Bot</h2>
            <div className="flex flex-wrap gap-2">
              {['How does a MOSFET work?', 'Why NAND in CPUs?', 'Explain my amplifier circuit'].map((q) => (
                <Badge key={q} className="cursor-pointer border-neonBlue/40 text-neonBlue" >
                  <button onClick={() => setChatInput(q)}>{q}</button>
                </Badge>
              ))}
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-neonBlue/20 bg-black/30 p-3">
              {chatHistory.map((msg, idx) => (
                <p key={idx} className={`rounded-lg p-2 text-sm ${msg.role === 'bot' ? 'bg-neonBlue/10' : 'bg-neonPurple/20'}`}>{msg.text}</p>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask any transistor question..." />
              <Button onClick={askSparky}><Zap className="h-4 w-4" /></Button>
            </div>
          </Card>
        )}

        {activePage === 'resources' && (
          <Card className="space-y-4">
            <h2 className="font-orbitron text-2xl text-neonBlue">Resources</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="bg-black/30">
                <p className="mb-2 font-semibold">Glossary</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(glossary).map((key) => (
                    <Button key={key} variant="secondary" onClick={() => setSelectedTerm(key)}>{key}</Button>
                  ))}
                </div>
                <p className="mt-3 text-sm">{selectedTerm}: {glossary[selectedTerm]}</p>
              </Card>
              <Card className="bg-black/30">
                <p className="mb-2 font-semibold">Timeline</p>
                <p className="text-sm">1947: First transistor. 1960s: IC boom. 1990s: mobile chips. Today: AI accelerators with billions of transistors.</p>
              </Card>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="bg-black/30">
                <p className="mb-2 font-semibold">Downloads</p>
                <Button variant="secondary">Circuit cheat sheet PDF</Button>
              </Card>
              <Card className="bg-black/30">
                <p className="mb-2 font-semibold">External links</p>
                <a className="block text-neonBlue underline" href="https://www.khanacademy.org/science/electrical-engineering" target="_blank">Khan Academy Electrical Engineering</a>
                <a className="block text-neonBlue underline" href="https://www.youtube.com/results?search_query=transistor+explained" target="_blank">YouTube transistor explainers</a>
              </Card>
            </div>
            <Button disabled={profile.badges.length < 3} variant={profile.badges.length === 3 ? 'default' : 'secondary'}>
              <Award className="mr-2 h-4 w-4" />
              Print my progress certificate
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}

export default App
