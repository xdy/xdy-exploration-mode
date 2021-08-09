/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: Jonas Karlsson
 * Content License: MIT
 * Software License: MIT
 */

// Import TypeScript modules
import { registerSettings } from './settings';
import { preloadTemplates } from './preloadTemplates';

const stashedTokens: TokenDocument[] = [];

// Initialize module
Hooks.once('init', async () => {
  console.log('xdy-exploration-mode | Initializing xdy-exploration-mode');

  // Assign custom classes and constants here

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
});

// Setup module
Hooks.once('setup', async () => {
  // Do anything after initialization but before ready
});

async function stashTokens(
  currentScene: Scene & {
    id: string;
    data: Scene['data'] & { _id: string; _source: Scene['data']['_source'] & { _id: string } };
  },
) {
  // all tokens assigned to a player  //TODO Should also find familiars etc, will this do that?
  currentScene?.tokens.filter((x) => x.hasPlayerOwner).forEach((x) => stashedTokens.push(x));

  //And, all selected non-player tokens
  canvas.tokens?.controlled
    .filter((token) => (token.data.actorId != null ? game.actors?.get(token.data.actorId) : null))
    .filter((token) => !token.document.hasPlayerOwner)
    .forEach((token) => stashedTokens.push(token.document));

  ui.notifications?.info('Click where you want to place party token.', { permanent: true });
  //TODO actually listen to mouse click, preferably with another mouse pointer
  //TODO for now, just assume that default location is ok
  //On clicking on map Ask if sure
  let agree = false;
  await Dialog.confirm({
    title: 'Delete',
    content: `Do you want to place party here? If not move token to where you want it before you press yes, or press cancel to abort placing party token.`,
    yes: () => (agree = true),
  });
  if (agree) {
    //Give it the highest of each (foundry): light, sight
    const data: Record<string, unknown> = {
      brightLight: Math.max(...stashedTokens.map((t) => t.data.brightLight)),
      dimLight: Math.max(...stashedTokens.map((t) => t.data.dimLight)),
      brightSight: Math.max(...stashedTokens.map((t) => t.data.brightSight)),
      dimSight: Math.max(...stashedTokens.map((t) => t.data.dimSight)),
      x: stashedTokens[0].data.x, //TODO Should be possible to choose token, or position
      y: stashedTokens[0].data.y,
    };
    //TODO Give it the highest of each (per system, handle at least for 5e and pf2e): Attribute, characteristic, skill.
    //TODO Give it the lowest of each (per system): Movement //TODO Look how dnd5e and pf2 handles it
    //TODO Let everything else be default I guess?

    //TODO Actually, get from sidebar
    const groupToken = <TokenDocument>await TokenDocument.create({});

    await currentScene.updateEmbeddedDocuments('Token', [data]);
    await currentScene.getEmbeddedDocument('Token', <string>groupToken.id);
    // TODO assign all players ownership to it. Somehow.
    //game.users?.players[0].assignPermission();

    // hide all player and selected actors and stash them somewhere (upper left corner by default, but should be selectable as in combat-booster)
    stashedTokens?.forEach((x) => {
      x.data.hidden = true;
      x.data.x = currentScene?.data.width || 0; //TODO Should be possible to instead put it on the same location as 'xdy-group-stash' token. And/or line them up on the lowest row of the scene
      x.data.y = currentScene?.data.height || 0;
      x.setFlag('xdy-exploration-mode', 'xdy-stashed', true);
      return;
    });
  } else {
    ui.notifications?.info('Replacing party with party token canceled.');
  }
  //TODO Restore mouse pointer, remove listener
}

async function unstashTokens(groupToken: TokenDocument) {
  // move all stashed actors to the party token (default: first one on the party token, the rest surrounding it.
  const partyPos = <[x: number, y: number]>(
    canvas.grid?.grid?.getGridPositionFromPixels(groupToken.data.x, groupToken.data.y)
  );
  const neighbours = <PointArray[]>canvas.grid?.grid?.getNeighbors(partyPos[0], partyPos[1]);
  neighbours.unshift(partyPos);
  for (let i = 0; i < stashedTokens.length; i++) {
    const stashed = stashedTokens[i];
    for (let j = 0; j < neighbours.length; j++) {
      const neighbour = neighbours[Math.min(i, j)]; //I.e. if more stashed tokens than neighbours, just stack them
      //TODO Check line of effect to neightbours[0], if none, skip this grid cell
      stashed.data.hidden = false;
      stashed.data.x = <number>canvas.grid?.grid?.getPixelsFromGridPosition(neighbour[0], neighbour[1])[0];
      stashed.data.y = <number>canvas.grid?.grid?.getPixelsFromGridPosition(neighbour[0], neighbour[1])[1];
      await stashed.unsetFlag('xdy-exploration-mode', 'xdy-stashed');
    }
  }
  // Remove the party token.
  await groupToken.delete();
}

function groupTokenInSidebar() {
  //TODO check if token named xdy-exploration-mode-token exists in sidebar, if not explain that it needs to be created
  //TODO Check if all players have ownership, if not explain that all players must have ownership of it.
  return false;
}

// When ready
Hooks.once('ready', async () => {
  if (!game.modules.get('lib-df-hotkeys')?.active) {
    console.error('Missing lib-df-hotkeys module dependency');
    if (game.user?.isGM)
      ui.notifications?.error(
        "'xdy-exploration-mode' requires the 'Library: DF Hotkeys' module. Please install and activate this dependency.",
      );
    return;
  }

  Hotkeys.registerShortcut({
    name: 'xdy-exploration-mode.place-xdy-exploration-mode-token', // <- Must be unique
    label: 'Place exploration-mode group token',
    default: () => {
      return { key: Hotkeys.keys.KeyE, alt: true, ctrl: true, shift: true };
    },
    onKeyDown: async () => {
      const currentScene = game.scenes?.current;
      if (!currentScene) return;
      if (!groupTokenInSidebar()) return;

      const groupToken = currentScene?.tokens.filter((x) => x.name === 'xdy-exploration-mode-token')[0]; //TODO using name now, do better
      if (!groupToken) {
        await stashTokens(currentScene);
      } else {
        await unstashTokens(groupToken);
      }
    },
  });
});

// Add any additional hooks if necessary
