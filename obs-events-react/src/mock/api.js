import programData from './program.json';
import speakersData from './speakers.json';
import sponsorsData from './sponsors.json';
import articlesData from './articles.json';
import eventsData from './events.json';
import chaptersData from './chapters.json';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(400 + Math.random() * 200);

// Helper: generate full days list from startAt
const getGeneratedDays = () => {
  const startDate = new Date(programData.startAt);
  const days = [];
  for (let i = 1; i <= 100; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + (i - 1));
    const dayStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    
    let theme = 'Ecosystem Scale & Networking';
    if (i === 1) theme = 'Kickoff: The Season Begins';
    else if (i === 50) theme = 'Mid-Season Spotlight';
    else if (i === 100) theme = 'Grand Finale Wrap-up';
    else if (i % 7 === 1) theme = 'Venture Capital & Finance';
    else if (i % 7 === 2) theme = 'SaaS & AI Technology';
    else if (i % 7 === 3) theme = 'D2C Brand Growth';
    else if (i % 7 === 4) theme = 'Global Trade & Logistics';
    else if (i % 7 === 5) theme = 'Leadership & Strategy';

    days.push({
      dayNumber: i,
      date: `${dayStr} ${d.getFullYear()}`,
      title: `Day ${i} Theme`,
      theme
    });
  }
  return days;
};

// Extend events dynamically with sprinkled program days
const getSprinkledEvents = () => {
  return eventsData.map((e) => {
    let day = e.programDayNumber;
    if (day === undefined || day === null) {
      // Sprinkle across ~40 days
      day = (e.id * 11) % 100 + 1;
      if (day > 80) day = null; // some events don't belong to the program
    }
    return {
      ...e,
      programDayNumber: day
    };
  });
};

export async function getProgram() {
  await randomDelay();
  // Season status
  const start = new Date(programData.startAt);
  const end = new Date(programData.endAt);
  const today = new Date();
  
  let seasonStatus = '';
  let currentDay = null;
  let progressPct = 0;

  if (today >= start && today <= end) {
    const diffTime = Math.abs(today - start);
    currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    seasonStatus = `Day ${currentDay} of 100`;
    progressPct = currentDay; // 1 day = 1%
  } else if (today < start) {
    const diffTime = Math.abs(start - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    seasonStatus = `Starts in ${diffDays} days`;
  } else {
    seasonStatus = `Next season: 15 Oct ${today.getFullYear() + 1}`;
  }

  return {
    ...programData,
    seasonStatus,
    currentDay,
    progressPct,
    days: getGeneratedDays()
  };
}

export async function getProgramDay(n, country = 'All') {
  await randomDelay();
  const days = getGeneratedDays();
  const dayInfo = days.find((d) => d.dayNumber === parseInt(n));
  if (!dayInfo) return null;

  let dayEvents = getSprinkledEvents().filter((e) => e.programDayNumber === parseInt(n));
  
  if (country && country !== 'All') {
    dayEvents = dayEvents.filter((e) => e.chapter.name.toLowerCase().includes(country.toLowerCase()));
  }

  return {
    dayNumber: parseInt(n),
    date: dayInfo.date,
    theme: dayInfo.theme,
    events: dayEvents
  };
}

export async function getSpeakers(params = {}) {
  await randomDelay();
  let list = [...speakersData];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter((s) => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q) || s.topics.some(t => t.toLowerCase().includes(q)));
  }
  if (params.topic) {
    list = list.filter((s) => s.topics.includes(params.topic));
  }
  return list;
}

export async function getSpeaker(slug) {
  await randomDelay();
  const speaker = speakersData.find((s) => s.slug === slug);
  if (!speaker) return null;

  // speaking at
  const speakingEvents = getSprinkledEvents().filter((e) => e.speakers && e.speakers.includes(speaker._id));
  return {
    ...speaker,
    events: speakingEvents
  };
}

export async function getSponsors(params = {}) {
  await randomDelay();
  let list = [...sponsorsData];
  if (params.tier) {
    list = list.filter((s) => s.tier === params.tier);
  }
  return list;
}

export async function submitPartnerApplication(payload) {
  await randomDelay();
  console.log('Partner application submitted:', payload);
  return { ok: true, message: 'Thanks — our partnerships team will be in touch.' };
}

export async function getArticles(params = {}) {
  await randomDelay();
  let list = [...articlesData];
  if (params.type && params.type !== 'ALL') {
    list = list.filter((a) => a.type === params.type);
  }
  return list;
}

export async function getArticle(slug) {
  await randomDelay();
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) return null;

  const related = articlesData.filter((a) => a.slug !== slug).slice(0, 3);
  return {
    ...article,
    related
  };
}

export async function getLaunches() {
  await randomDelay();
  return getSprinkledEvents().filter((e) => e.isLaunch);
}

// Global state in-memory for user created chapters (persisted for session)
let communityChapters = [];

export async function createChapter(payload) {
  await randomDelay();
  const newChapter = {
    name: payload.name,
    flag: payload.flag || '',
    letter: payload.name[0],
    tier: 'Community',
    isOfficial: false,
    status: 'Under review',
    slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    creatorEmail: payload.creatorEmail || 'bhavesh@example.com',
    description: payload.description
  };
  communityChapters.push(newChapter);
  return { ok: true, chapter: newChapter };
}

export async function getMyChapters(email = 'bhavesh@example.com') {
  await randomDelay();
  const baseCommunity = chaptersData.filter((c) => !c.isOfficial && c.creatorEmail === email);
  const sessionCreated = communityChapters.filter((c) => c.creatorEmail === email);
  return [...baseCommunity, ...sessionCreated];
}

export async function getChapters() {
  await randomDelay();
  const official = chaptersData.filter((c) => c.isOfficial);
  return {
    official,
    community: [...chaptersData.filter((c) => !c.isOfficial), ...communityChapters]
  };
}

export async function getEvents() {
  await randomDelay();
  return getSprinkledEvents();
}
