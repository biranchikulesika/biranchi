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
    primaryColor: 'text-foreground',
    accentColor: 'text-primary',
    hoverColor: 'hover:text-foreground/80',
    borderColor: 'border-border',
    iconBgColor: 'bg-muted',
    titleFont: 'font-serif tracking-tight',
    bodyFont: 'font-sans',
    metaFont: 'font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-primary',
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
    containerClass: 'bg-background text-foreground transition-colors duration-500'
  },
  thinker: {
    primaryColor: 'text-foreground',
    accentColor: 'text-primary',
    hoverColor: 'hover:text-foreground/80',
    borderColor: 'border-border',
    iconBgColor: 'bg-muted',
    titleFont: 'font-cormorant',
    bodyFont: 'font-sans',
    metaFont: 'font-mono text-[9.5px] uppercase tracking-[0.25em] text-primary',
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
    containerClass: 'bg-background text-foreground transition-colors duration-500'
  },
  builder: {
    primaryColor: 'text-foreground',
    accentColor: 'text-primary',
    hoverColor: 'hover:text-foreground/80',
    borderColor: 'border-border',
    iconBgColor: 'bg-muted',
    titleFont: 'font-sans font-semibold tracking-tight',
    bodyFont: 'font-sans',
    metaFont: 'text-primary text-[9.5px] uppercase tracking-widest font-mono',
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
    containerClass: 'bg-background text-foreground transition-colors duration-500'
  },
  operator: {
    primaryColor: 'text-foreground',
    accentColor: 'text-primary',
    hoverColor: 'hover:text-foreground/80 transition-opacity',
    borderColor: 'border-border',
    iconBgColor: 'bg-muted',
    titleFont: 'font-mono uppercase font-bold',
    bodyFont: 'font-mono',
    metaFont: 'font-mono text-[10px] uppercase tracking-widest text-primary',
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
    containerClass: 'bg-background text-foreground transition-colors duration-500'
  },
  main: {
    primaryColor: 'text-foreground',
    accentColor: 'text-primary',
    hoverColor: 'hover:text-foreground/80',
    borderColor: 'border-border',
    iconBgColor: 'bg-muted',
    titleFont: 'font-serif tracking-tight',
    bodyFont: 'font-sans',
    metaFont: 'font-mono text-[9.5px] uppercase tracking-widest text-primary',
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
    containerClass: 'bg-background text-foreground transition-colors duration-500'
  }
};
