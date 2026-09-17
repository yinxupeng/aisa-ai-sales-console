import { build } from "esbuild";
import { join } from "path";
import { rmSync } from "fs";

const tmpBundle = join(process.cwd(), ".runtime-test-bundle.mjs");
const runnerCode = `
import React from 'react';
import { renderToString } from 'react-dom/server';

import DashboardPage from './src/pages/DashboardPage.jsx';
import ConversationsPage from './src/pages/ConversationsPage.jsx';
import SalesPage from './src/pages/SalesPage.jsx';
import WecomChannelPage from './src/pages/WecomChannelPage.jsx';
import WecomAccountPage from './src/pages/WecomAccountPage.jsx';
import IntelligentAgentPage from './src/pages/IntelligentAgentPage.jsx';
import StrategyPage from './src/pages/StrategyPage.jsx';
import StrategyEditor from './src/pages/StrategyEditor.jsx';
import AISkillPage from './src/pages/AISkillPage.jsx';
import ToolsPage from './src/pages/ToolsPage.jsx';
import KnowledgePage from './src/pages/KnowledgePage.jsx';
import HumanizationPage from './src/pages/HumanizationPage.jsx';
import TagLibraryPage from './src/pages/TagLibraryPage.jsx';
import DataDictionaryPage from './src/pages/DataDictionaryPage.jsx';
import StrategyInsightPage from './src/pages/StrategyInsightPage.jsx';
import MassMessagePage from './src/pages/MassMessagePage.jsx';
import SettingsPage from './src/pages/SettingsPage.jsx';
import CustomersPage from './src/pages/CustomersPage.jsx';
import CompanyPage from './src/pages/CompanyPage.jsx';
import WecomPage from './src/pages/WecomPage.jsx';
import SuggestionsPage from './src/pages/SuggestionsPage.jsx';
import { strategies } from './src/data/appData.js';

globalThis.window = { location: { search: '' }, matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }) };

const pages = [
  ['DashboardPage', React.createElement(DashboardPage, { setRoute: () => {}, conversationsData: [] })],
  ['CustomersPage', React.createElement(CustomersPage, { onViewConversation: () => {}, visibleWecomKeys: [] })],
  ['CompanyPage', React.createElement(CompanyPage, { platform: true })],
  ['IntelligentAgentPage', React.createElement(IntelligentAgentPage)],
  ['StrategyPage', React.createElement(StrategyPage)],
  ['StrategyEditor', React.createElement(StrategyEditor, { skill: strategies[0], onBack: () => {} })],
  ['AISkillPage', React.createElement(AISkillPage)],
  ['ToolsPage', React.createElement(ToolsPage)],
  ['KnowledgePage', React.createElement(KnowledgePage)],
  ['TagLibraryPage', React.createElement(TagLibraryPage, { onViewConversation: () => {} })],
  ['DataDictionaryPage', React.createElement(DataDictionaryPage)],
  ['StrategyInsightPage', React.createElement(StrategyInsightPage, { onViewConversation: () => {} })],
  ['MassMessagePage', React.createElement(MassMessagePage)],
  ['WecomPage', React.createElement(WecomPage)],
  ['SalesPage', React.createElement(SalesPage)],
  ['WecomChannelPage', React.createElement(WecomChannelPage)],
  ['WecomAccountPage', React.createElement(WecomAccountPage)],
  ['HumanizationPage', React.createElement(HumanizationPage)],
  ['ConversationsPage', React.createElement(ConversationsPage, { activeWecom: 'wecom-1', activeConversationKey: '', autoOpenCustomerDrawerToken: 0, visibleWecomKeys: ['wecom-1'], onActiveWecomChange: () => {} })],
  ['ConversationsPageListMode', React.createElement(ConversationsPage, { activeWecom: 'wecom-1', activeConversationKey: '', autoOpenCustomerDrawerToken: 0, visibleWecomKeys: ['wecom-1'], conversationViewMode: 'list', onActiveWecomChange: () => {} })],
  ['SuggestionsPage', React.createElement(SuggestionsPage)],
  ['SettingsPage', React.createElement(SettingsPage, { platform: true })]
];

for (const [name, el] of pages) {
  try {
    renderToString(el);
  } catch (err) {
    console.error('FAIL: ' + name, err);
    process.exit(1);
  }
}
console.log(\`ALL \${pages.length} PAGE CASES RENDERED CLEANLY (0 WHITE SCREEN / 0 REFERENCE ERROR)\`);
`;

await build({
  stdin: {
    contents: runnerCode,
    resolveDir: process.cwd(),
    loader: 'jsx',
  },
  bundle: true,
  format: 'esm',
  target: 'es2020',
  outfile: tmpBundle,
  loader: { '.js': 'jsx' }
});

try {
  await import(tmpBundle);
} finally {
  try { rmSync(tmpBundle); } catch {}
}

process.exit(0);
