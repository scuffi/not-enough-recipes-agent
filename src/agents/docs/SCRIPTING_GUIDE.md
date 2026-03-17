# Not Enough Recipes - JavaScript Scripting API

Welcome to the NER JavaScript scripting system! This allows you to create custom behaviors for items, blocks, and game events using JavaScript.

## Basic Structure

Every script registers event handlers and explicitly checks conditions:

```javascript
// Example: ruby_effects.js
Event.on("player_tick", (event) => {
  const player = event.player;

  // IMPORTANT: Explicitly check if player is holding the item
  if (NER.isHolding(player, "ruby")) {
    // Your custom behavior here
    NER.applyEffect(player, "minecraft:slowness", 20, 0);
  }
});
```

## Event System

The scripting system provides **16 comprehensive events** covering interactions, blocks, entities, and player lifecycle.

### Quick Reference

| Event             | When it Fires                  | Cancellable |
| ----------------- | ------------------------------ | ----------- |
| `item_use`        | Player right-clicks with item  | ✅          |
| `item_pickup`     | Player picks up item           | ✅          |
| `item_drop`       | Player drops item              | ✅          |
| `item_craft`      | Player crafts item             | ❌          |
| `block_break`     | Player breaks block            | ✅          |
| `block_place`     | Player places block            | ✅          |
| `block_interact`  | Player right-clicks block      | ✅          |
| `entity_attack`   | Player attacks entity          | ✅          |
| `entity_interact` | Player right-clicks entity     | ✅          |
| `living_hurt`     | Living entity takes damage     | ✅          |
| `entity_death`    | Entity dies                    | ❌          |
| `player_tick`     | Every tick per player (20/sec) | ❌          |
| `player_death`    | Player dies                    | ❌          |
| `player_respawn`  | Player respawns                | ❌          |
| `player_join`     | Player joins server            | ❌          |
| `player_leave`    | Player leaves server           | ❌          |

### Item & Interaction Events

#### `item_use`

**When:** Player right-clicks with an item  
**Cancellable:** Yes  
**Properties:** `player`, `world`, `itemStack`, `hand`

```javascript
Event.on("item_use", (event) => {
  if (NER.isCustomItem(event.itemStack, "magic_wand")) {
    NER.sendMessage(event.player, "Magic wand activated!");
    event.setResult("SUCCESS"); // or "FAIL", "CONSUME", "PASS"
  }
});
```

#### `item_pickup`

**When:** Player picks up an item from the ground  
**Cancellable:** Yes  
**Properties:** `player`, `world`, `itemStack`

```javascript
Event.on("item_pickup", (event) => {
  if (NER.isCustomItem(event.itemStack, "cursed_item")) {
    NER.sendMessage(event.player, "You picked up a cursed item!");
    event.cancel(); // Prevent pickup
  }
});
```

#### `item_drop`

**When:** Player drops an item (Q key)  
**Cancellable:** Yes  
**Properties:** `player`, `world`, `itemStack`

```javascript
Event.on("item_drop", (event) => {
  if (NER.isCustomItem(event.itemStack, "quest_item")) {
    NER.sendMessage(event.player, "You cannot drop quest items!");
    event.cancel();
  }
});
```

#### `item_craft`

**When:** Player crafts an item  
**Cancellable:** No  
**Properties:** `player`, `world`, `itemStack`

```javascript
Event.on("item_craft", (event) => {
  if (NER.isCustomItem(event.itemStack, "legendary_sword")) {
    NER.sendMessage(event.player, "You crafted a legendary weapon!");
  }
});
```

### Block Events

#### `block_break`

**When:** Player breaks a block (before destruction)  
**Cancellable:** Yes  
**Properties:** `player`, `world`, `pos`, `blockId`

```javascript
Event.on("block_break", (event) => {
  if (NER.isHolding(event.player, "super_pickaxe")) {
    NER.sendMessage(event.player, "Super pickaxe breaks 3x3!");
    // Custom 3x3 break logic here
  }
});
```

#### `block_place`

**When:** Player places a block  
**Cancellable:** Yes  
**Properties:** `player`, `world`, `pos`, `blockId`, `itemStack`

```javascript
Event.on("block_place", (event) => {
  if (event.blockId.includes("tnt")) {
    NER.sendMessage(event.player, "No TNT allowed here!");
    event.cancel();
  }
});
```

#### `block_interact`

**When:** Player right-clicks a block  
**Cancellable:** Yes  
**Properties:** `player`, `world`, `pos`, `blockId`, `hand`, `face`

```javascript
Event.on("block_interact", (event) => {
  if (
    event.blockId.includes("chest") &&
    NER.isHolding(event.player, "skeleton_key")
  ) {
    NER.sendMessage(event.player, "Unlocked with skeleton key!");
  }
});
```

### Entity Events

#### `entity_attack`

**When:** Player attacks an entity (left-click)  
**Cancellable:** Yes  
**Properties:** `player`, `world`, `entityType`

```javascript
Event.on("entity_attack", (event) => {
  if (NER.isHolding(event.player, "super_sword")) {
    NER.sendMessage(event.player, "Critical strike!");
    const entity = event.getEntity();
    entity.hurt(
      event.player
        .getJavaObject()
        .getDamageSources()
        .playerAttack(event.player.getJavaObject()),
      10.0,
    );
  }
});
```

#### `entity_interact`

**When:** Player right-clicks an entity  
**Cancellable:** Yes  
**Properties:** `player`, `world`, `entityType`, `hand`

```javascript
Event.on("entity_interact", (event) => {
  if (
    event.entityType.includes("villager") &&
    NER.isHolding(event.player, "emerald_staff")
  ) {
    NER.sendMessage(event.player, "Special villager trade unlocked!");
  }
});
```

#### `living_hurt`

**When:** Any living entity takes damage  
**Cancellable:** Yes  
**Properties:** `world`, `entityType`, `damage`, `damageSource`, `attacker` (may be null)

```javascript
Event.on("living_hurt", (event) => {
  if (
    event.attacker &&
    NER.isWearing(event.attacker, "ruby_chestplate", "CHEST")
  ) {
    NER.log("Ruby armor increased damage!");
  }
});
```

#### `entity_death`

**When:** Any entity dies  
**Cancellable:** No  
**Properties:** `world`, `entityType`, `damageSource`, `killer` (may be null)

```javascript
Event.on("entity_death", (event) => {
  if (event.killer && event.entityType.includes("ender_dragon")) {
    NER.giveItem(event.killer, "legendary_trophy", 1);
    NER.sendMessage(event.killer, "You defeated the dragon!");
  }
});
```

### Player Events

#### `player_tick`

**When:** Every game tick (20 times/second) for each player  
**Cancellable:** No  
**Properties:** `player`, `world`

```javascript
Event.on("player_tick", (event) => {
  if (NER.isHolding(event.player, "ruby")) {
    if (event.player.getHealth() < 20) {
      event.player.getJavaObject().heal(0.1);
    }
  }
});
```

#### `player_death`

**When:** Player dies  
**Cancellable:** No  
**Properties:** `player`, `world`, `damageSource`

```javascript
Event.on("player_death", (event) => {
  if (NER.hasInInventory(event.player, "phoenix_feather")) {
    NER.sendMessage(event.player, "Phoenix feather saved you!");
    // Custom respawn logic
  }
});
```

#### `player_respawn`

**When:** Player respawns after death  
**Cancellable:** No  
**Properties:** `player`, `world`, `conqueredEnd`

```javascript
Event.on("player_respawn", (event) => {
  NER.sendMessage(event.player, "Welcome back!");
  NER.giveItem(event.player, "starter_kit", 1);
});
```

#### `player_join`

**When:** Player joins the server  
**Cancellable:** No  
**Properties:** `player`, `world`

```javascript
Event.on("player_join", (event) => {
  NER.sendMessage(event.player, "Welcome to the server!");
  NER.log(event.player.getName() + " joined the game");
});
```

#### `player_leave`

**When:** Player leaves the server  
**Cancellable:** No  
**Properties:** `player`, `world`

```javascript
Event.on("player_leave", (event) => {
  NER.log(event.player.getName() + " left the game");
});
```

### Projectile Events

#### `projectile_hit`

**When:** Any projectile (arrow, fireball, etc.) hits something  
**Cancellable:** No  
**Properties:** `world`, `projectileType`, `hitType`, `shooter`, `hitPos`, `hitEntityType`

```javascript
Event.on("projectile_hit", (event) => {
  if (event.shooter && event.hitType === "ENTITY") {
    if (NER.isHolding(event.shooter, "magic_bow")) {
      NER.spawnParticle(event.world, event.hitPos, "explosion");
    }
  }
});
```

## NER Helper API

The global `NER` object provides convenient helper methods:

> **Note**: All NER methods have wrapper overloads! You can pass either raw Minecraft objects (Player, ItemStack, Level, BlockPos) or their wrapper types (PlayerWrapper, ItemStackWrapper, WorldWrapper, BlockPosWrapper). This means you can use event objects directly without calling `.getJavaObject()`:
>
> ```javascript
> // Both work!
> NER.isHolding(event.player, "ruby"); // PlayerWrapper
> NER.isHolding(event.player.getJavaObject(), "ruby"); // Player
> ```

### Item Checks

```javascript
// Check if player is holding an item in either hand
NER.isHolding(player, "ruby");

// Check if player is holding an item in a specific hand
NER.isHolding(player, "ruby", "MAIN_HAND"); // or "OFF_HAND"

// Check if player is wearing an item
NER.isWearing(player, "speed_boots", "FEET"); // FEET, LEGS, CHEST, HEAD

// Check if player has item in inventory
NER.hasInInventory(player, "ruby");

// Get held item
const item = NER.getHeldItem(player, "MAIN_HAND");
```

### Custom Item Utilities

```javascript
// Check if ItemStack is a specific custom item
NER.isCustomItem(itemStack, "ruby");

// Get custom item ID (returns null if not custom)
const itemId = NER.getCustomItemId(itemStack); // Returns "ruby"

// Check if ItemStack is any custom NER item
NER.isAnyCustomItem(itemStack);
```

### World Manipulation

```javascript
// Spawn particles
NER.spawnParticle(world, player.getPosition(), "minecraft:flame");
// Available: flame, smoke, heart, enchant, portal, explosion, etc.

// Play sounds
NER.playSound(
  world,
  player.getPosition(),
  "minecraft:entity.player.levelup",
  1.0,
  1.0,
);
```

### Player Utilities

```javascript
// Give items to player
NER.giveItem(player, "ruby", 5); // Give 5 rubies
NER.giveItem(player, "minecraft:diamond", 1); // Works with vanilla items too

// Send messages
NER.sendMessage(player, "Hello from JavaScript!");

// Apply potion effects
NER.applyEffect(player, "minecraft:speed", 200, 1); // effect, duration (ticks), amplifier
```

### Logging

```javascript
NER.log("This appears in server logs");
NER.debug("Debug message (only shows if debug logging enabled)");
```

## Wrapper Classes

Event contexts provide wrapper objects for easier access to Minecraft objects.

### PlayerWrapper

```javascript
const player = event.player;

// Basic info
player.getName(); // String
player.getUuid(); // String

// Health and status
player.getHealth(); // float
player.getMaxHealth(); // float
player.getFoodLevel(); // float
player.isCreative(); // boolean
player.isSurvival(); // boolean
player.isAlive(); // boolean
player.isSneaking(); // boolean
player.isSprinting(); // boolean
player.isOnFire(); // boolean

// Position
player.getX(); // double
player.getY(); // double
player.getZ(); // double
player.getBlockPos(); // BlockPosWrapper
player.getPosition(); // Vec3

// Experience
player.getExperienceLevel(); // int
player.getTotalExperience(); // int

// Methods
player.heal(amount);
player.setHealth(health);
player.giveExperienceLevels(levels);

// Direct Java access
player.getJavaObject(); // Returns Minecraft Player object
```

### WorldWrapper

```javascript
const world = event.world;

// Info
world.getDimensionKey(); // String (e.g., "minecraft:overworld")
world.isClientSide(); // boolean
world.isServerSide(); // boolean

// Time and weather
world.getGameTime(); // long
world.getDayTime(); // long
world.isDay(); // boolean
world.isNight(); // boolean
world.isRaining(); // boolean
world.isThundering(); // boolean

// Block access
world.getBlockState(pos); // BlockState
world.getBlockIdAt(x, y, z); // String
world.isAir(pos); // boolean

// Block manipulation
world.destroyBlock(pos, dropItems); // boolean
world.setBlock(pos, blockState); // boolean

// Direct Java access
world.getJavaObject(); // Returns Minecraft Level object
```

### ItemStackWrapper

```javascript
const itemStack = event.itemStack;

// Info
itemStack.getId(); // String (e.g., "minecraft:diamond")
itemStack.getNamespace(); // String (e.g., "minecraft")
itemStack.getPath(); // String (e.g., "diamond")
itemStack.getDisplayName(); // String
itemStack.getCount(); // int
itemStack.isEmpty(); // boolean

// Durability
itemStack.isDamageable(); // boolean
itemStack.getDamage(); // int
itemStack.getMaxDamage(); // int
itemStack.getRemainingDurability(); // int

// NER custom item checks
itemStack.isCustomItem(); // boolean (is this an NER item?)
itemStack.getCustomItemId(); // String or null

// Direct Java access
itemStack.getJavaObject(); // Returns Minecraft ItemStack object
```

### BlockPosWrapper

```javascript
const pos = event.pos;

// Coordinates
pos.getX(); // int
pos.getY(); // int
pos.getZ(); // int

// Offsets
pos.offset(x, y, z); // BlockPos
pos.above(); // BlockPos
pos.below(); // BlockPos
pos.north(); // BlockPos
pos.south(); // BlockPos
pos.east(); // BlockPos
pos.west(); // BlockPos

// Distance
pos.distanceTo(otherPos); // double
pos.distanceToPos(x, y, z); // double

// Direct Java access
pos.getJavaObject(); // Returns Minecraft BlockPos object
```

## Direct Java Access

All wrapper classes provide a `getJavaObject()` method for direct access to Minecraft's API:

```javascript
Event.on("player_tick", (event) => {
  const player = event.player;

  // Use wrapper methods (easier)
  if (player.getHealth() < 10) {
    player.heal(1.0);
  }

  // Or use direct Java API (more powerful)
  const javaPlayer = player.getJavaObject();
  javaPlayer.setAbsorptionAmount(4.0); // Add absorption hearts
  javaPlayer.getFoodData().setFoodLevel(20);
});
```

## Complete Examples

### Example 1: Ruby Effects

```javascript
// ruby_effects.js - Applies custom effects when holding ruby
Event.on("player_tick", (event) => {
  const player = event.player;

  if (NER.isHolding(player, "ruby")) {
    // Apply slowness
    NER.applyEffect(player, "minecraft:slowness", 20, 0);

    // Slowly heal player
    if (player.getHealth() < player.getMaxHealth()) {
      player.heal(0.1);
    }
  }
});

Event.on("item_use", (event) => {
  if (NER.isCustomItem(event.itemStack, "ruby")) {
    NER.spawnParticle(
      event.world,
      event.player.getPosition(),
      "minecraft:flame",
    );
    NER.sendMessage(event.player, "Ruby power activated!");
    event.setResult("SUCCESS");
  }
});
```

### Example 2: Custom Pickaxe (3x3 Mining)

```javascript
// custom_pickaxes.js - 3x3 mining for custom pickaxes
const customPickaxes = ["ruby_pickaxe", "sapphire_pickaxe"];

Event.on("block_break", (event) => {
  const tool = NER.getHeldItem(event.player, "MAIN_HAND");
  const itemId = NER.getCustomItemId(tool);

  if (customPickaxes.includes(itemId)) {
    breakNearbyBlocks(event.world, event.pos, 1);
    NER.log(`${itemId} mined 3x3 area`);
  }
});

function breakNearbyBlocks(world, centerPos, radius) {
  const javaWorld = world.getJavaObject();
  const javaPos = centerPos.getJavaObject();

  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      for (let z = -radius; z <= radius; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        javaWorld.destroyBlock(javaPos.offset(x, y, z), true);
      }
    }
  }
}
```

### Example 3: Proximity Effects

```javascript
// proximity_effects.js - Effects based on nearby blocks
Event.on("player_tick", (event) => {
  const player = event.player;

  if (!NER.isHolding(player, "magic_wand")) return;

  const world = event.world.getJavaObject();
  const pos = player.getBlockPos().getJavaObject();

  // Check 5 block radius for diamond blocks
  for (let x = -5; x <= 5; x++) {
    for (let y = -5; y <= 5; y++) {
      for (let z = -5; z <= 5; z++) {
        const checkPos = pos.offset(x, y, z);
        const block = world.getBlockState(checkPos).getBlock();

        if (block.toString().includes("diamond_block")) {
          NER.applyEffect(player, "minecraft:luck", 20, 2);
          return; // Exit early
        }
      }
    }
  }
});
```

### Example 4: Multi-Condition Handler

```javascript
// conditional_effects.js - Complex conditional logic
Event.on("player_tick", (event) => {
  const player = event.player;
  const world = event.world;

  // Check multiple conditions
  const hasRuby = NER.isHolding(player, "ruby");
  const hasMagicWand = NER.isHolding(player, "magic_wand");
  const isNight = world.isNight();
  const isInNether = world.getDimensionKey().includes("nether");

  // Apply effects based on combinations
  if (hasRuby && isNight) {
    NER.applyEffect(player, "minecraft:night_vision", 20, 0);
  }

  if (hasMagicWand && isInNether) {
    NER.applyEffect(player, "minecraft:fire_resistance", 20, 0);
  }

  // Check inventory for specific item
  if (NER.hasInInventory(player, "rainbow_gem")) {
    player.giveExperiencePoints(1);
  }
});
```

## Configuration

Edit `config.json` in this directory to configure the script system:

```json
{
  "enabled": true,
  "sandbox": {
    "allow_file_access": false,
    "allow_network_access": false,
    "max_execution_time_ms": 5000
  }
}
```

- **enabled**: Enable/disable the entire script system
- **allow_file_access**: Allow scripts to read/write files (security risk!)
- **allow_network_access**: Allow scripts to make network requests (security risk!)
- **max_execution_time_ms**: Maximum time a script can run before timing out

## Best Practices

1. **Always check conditions explicitly** - Scripts are not auto-bound to items
2. **Be efficient** - `player_tick` fires 20 times per second, keep logic fast
3. **Use early returns** - Exit event handlers early when conditions aren't met
4. **Handle errors** - Wrap risky code in try-catch blocks
