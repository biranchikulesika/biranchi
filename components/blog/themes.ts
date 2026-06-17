export interface PersonaTheme {
  primaryColor: string;
  accentColor: string;
  hoverColor: string;
  borderColor: string;
  iconBgColor: string;
  
  // Font classes
  titleFont: string;
  bodyFont: string;
  metaFont: string;
  
  // Wording / Labels
  archiveTitle: string;
  archiveSubtitle: string;
  homeTitle: string;
  homeSubtitle: string;
  seeAllText: string;
  searchText: string;
  readBtnText: string;
  recentTitle: string;
  stripTitle: string;
  stripLinkText: string;
  
  // Outer theme container styles
  containerClass: string;
}

export const PERSONA_BLOG_THEMES: Record<string, PersonaTheme> = {
  wanderer: {
    primaryColor: 'dark:text-[#F3F2EE] text-[#1C1C1E]',
    accentColor: 'dark:text-[#C58059] text-[#A66039]',
    hoverColor: 'dark:hover:text-[#D59069] hover:text-[#B67A55]',
    borderColor: 'dark:border-[#262629] border-[#E5E2DB]',
    iconBgColor: 'dark:bg-[#1A1A1E] bg-[#EAE8E3]',
    titleFont: 'font-serif tracking-tight',
    bodyFont: 'font-sans',
    metaFont: 'font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#A66039] dark:text-[#C58059]',
    archiveTitle: 'Inside The Head Archive',
    archiveSubtitle: 'A complete historical record of Inside The Head dispatches, raw thoughts, and bitter truths.',
    homeTitle: 'Inside The Head',
    homeSubtitle: 'Raw thoughts. Bitter truths. Sharp questions.',
    seeAllText: 'View Complete Notebook Feed',
    searchText: 'Search the notebook...',
    readBtnText: 'Read Essay',
    recentTitle: 'Latest Publications',
    stripTitle: 'From The Notebook',
    stripLinkText: 'OPEN NOTEBOOK',
    containerClass: 'dark:bg-[#0A0A0B] bg-[#FAFAF9] dark:text-[#E2E2E6] text-[#202022] transition-colors duration-500'
  },
  thinker: {
    primaryColor: 'dark:text-[#D7D4CE] text-[#2F3134]',
    accentColor: 'dark:text-[#9A9388] text-[#7F786F]',
    hoverColor: 'hover:text-stone-500 dark:hover:text-stone-400',
    borderColor: 'dark:border-stone-850 border-[#E2DFDA]',
    iconBgColor: 'dark:bg-[#242A31]/30 bg-[#E2DFDA]/30',
    titleFont: 'font-cormorant',
    bodyFont: 'font-sans',
    metaFont: 'font-mono text-[9.5px] uppercase tracking-[0.25em] text-[#7F786F] dark:text-[#9A9388]',
    archiveTitle: 'Evolving Synapses',
    archiveSubtitle: 'Chronological timeline of structured inquiries, dialectics, dialogues, and solitude essays.',
    homeTitle: 'Reflective Intellect',
    homeSubtitle: 'Sinking under instant consensus to find conscience, tracing solitude sanctuary against noise economy.',
    seeAllText: 'Query Complete Archives',
    searchText: 'Query ideas and metadata...',
    readBtnText: 'Inspect Dialogues',
    recentTitle: 'Active Reflections',
    stripTitle: 'From The Head',
    stripLinkText: 'OPEN ARCHIVE',
    containerClass: 'dark:bg-[#111417] bg-[#F4F3F1] dark:text-[#D7D4CE] text-[#2F3134]'
  },
  builder: {
    primaryColor: 'dark:text-neutral-100 text-[#111111]',
    accentColor: 'text-orange-500',
    hoverColor: 'hover:text-orange-400 dark:hover:text-orange-500',
    borderColor: 'dark:border-neutral-900 border-[#E7E4DD]',
    iconBgColor: 'dark:bg-neutral-900 bg-[#E7E4DD]',
    titleFont: 'font-sans font-semibold tracking-tight',
    bodyFont: 'font-sans',
    metaFont: 'font-[#8B867C] dark:text-neutral-500 text-[9.5px] uppercase tracking-widest font-mono',
    archiveTitle: 'The Forge Catalogue',
    archiveSubtitle: 'A structured list of releases, ADR blueprints, hardware optimizations, and operational bedrock summaries.',
    homeTitle: 'Blueprint Dispatches',
    homeSubtitle: 'Bedrock solutions, deliberate design friction, native parsing compiler strategies, and modular interfaces.',
    seeAllText: 'Explore Archive Log',
    searchText: 'Analyze dev compiler branches...',
    readBtnText: 'Inspect Blueprint',
    recentTitle: 'Modular Build Specs',
    stripTitle: 'From The Workshop',
    stripLinkText: 'OPEN LOGBOOK',
    containerClass: 'dark:bg-neutral-950 bg-[#F3F2EE] dark:text-neutral-300 text-[#222222]'
  },
  operator: {
    primaryColor: 'dark:text-[#a0bfab] text-[#121c15]',
    accentColor: 'dark:text-[#7f9e8a] text-[#5F7A69]',
    hoverColor: 'hover:opacity-75 transition-opacity',
    borderColor: 'dark:border-[#1e2722] border-[#D6DED5]',
    iconBgColor: 'dark:bg-[#1e2722]/50 bg-[#D6DED5]/50',
    titleFont: 'font-mono uppercase font-bold',
    bodyFont: 'font-mono',
    metaFont: 'font-mono text-[10px] uppercase tracking-widest dark:text-[#4e6054] text-[#5C6A61]',
    archiveTitle: 'INDEX_SYS_HIST',
    archiveSubtitle: 'Telemetry database record sequence, including cluster disruptions and incident logs.',
    homeTitle: 'Telemetry Feed',
    homeSubtitle: 'Tracking clock drift parameters, configuration deviations, integrity alerts, and background indices.',
    seeAllText: 'HEX_VAL_QUERY_ALL',
    searchText: 'SYS_QUERY_HIST_STABILITY_RECORDS...',
    readBtnText: '[HEX_STREAM_DECODE]',
    recentTitle: 'Active Signals Log',
    stripTitle: 'From The Terminal',
    stripLinkText: 'OPEN RECORDS',
    containerClass: 'dark:bg-[#080b09] bg-[#EDF1EC] dark:text-[#7f9e8a] text-[#1F2822]'
  },
  main: {
    primaryColor: 'dark:text-[#e5e5e5] text-[#2B2B28]',
    accentColor: 'dark:text-stone-400 text-stone-600',
    hoverColor: 'dark:hover:text-stone-300 hover:text-stone-800',
    borderColor: 'dark:border-stone-800/40 border-[#ECEBE6]',
    iconBgColor: 'dark:bg-stone-900/10 bg-[#E8E6DF]',
    titleFont: 'font-serif tracking-tight',
    bodyFont: 'font-sans',
    metaFont: 'font-mono text-[9.5px] uppercase tracking-widest text-[#6E6A64] dark:text-stone-400',
    archiveTitle: 'Ecosystem Chronicles',
    archiveSubtitle: 'A consolidated visual index of dispatches from Forge, Signal, Scribble, and Inside the Head.',
    homeTitle: 'Ecosystem Logs',
    homeSubtitle: 'Blueprints, signals, dialectics, and scribbles. The collective intelligence network.',
    seeAllText: 'Browse Absolute Archives',
    searchText: 'Search universe...',
    readBtnText: 'Read Dispatch',
    recentTitle: 'Consolidated Stream',
    stripTitle: 'Consolidated Archives',
    stripLinkText: 'OPEN UNIFIED FEED',
    containerClass: 'dark:bg-[#050505] bg-[#F5F5F2] dark:text-[#e2e2e6] text-[#2B2B28] transition-colors duration-500'
  }
};
