#!/usr/bin/env node

import { Command } from 'commander';
import { TarkovSearch } from './search';
import { startServer } from './server';

const program = new Command();

program
  .name('tarkov')
  .description('CLI and web tool for searching Tarkov items, quests, ammo, keys, and bosses')
  .version('1.0.0');

// Main search command
program
  .argument('[query...]', 'Search query (item name, quest, ammo, key, or boss)')
  .option('-w, --web', 'Start web server')
  .action(async (query: string[], options) => {
    if (options.web) {
      // Start web server
      startServer();
    } else if (query && query.length > 0) {
      // Perform search
      const searchQuery = query.join(' ');
      const search = new TarkovSearch();
      await search.search(searchQuery);
    } else {
      program.help();
    }
  });

// Quest command
program
  .command('quest <name...>')
  .description('Search for a quest')
  .action(async (name: string[]) => {
    const questName = name.join(' ');
    const search = new TarkovSearch();
    await search.search(questName, 'quest');
  });

// Ammo command
program
  .command('ammo <name...>')
  .description('Search for ammunition')
  .action(async (name: string[]) => {
    const ammoName = name.join(' ');
    const search = new TarkovSearch();
    await search.search(ammoName, 'ammo');
  });

// Key command
program
  .command('key <name...>')
  .description('Search for a key')
  .action(async (name: string[]) => {
    const keyName = name.join(' ');
    const search = new TarkovSearch();
    await search.search(keyName, 'key');
  });

// Boss command
program
  .command('boss <name...>')
  .description('Search for a boss')
  .action(async (name: string[]) => {
    const bossName = name.join(' ');
    const search = new TarkovSearch();
    await search.search(bossName, 'boss');
  });

program.parse();
