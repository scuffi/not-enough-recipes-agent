# Dynamic Registry Schema - Complete Guide

## CRITICAL: Food Items in Minecraft 1.21.11+

**In Minecraft 1.21.11, you MUST use BOTH components to make food items:**

1. **`consumable`** - Makes the item consumable (eat/drink action)
2. **`food`** - Provides nutrition stats

### Food Item Template (REQUIRED FORMAT)

```json
{
  "id": "healing_apple",
  "texture": "apple",
  "components": {
    "consumable": {
      "consume_seconds": 1.6,
      "animation": "eat",
      "has_consume_particles": true,
      "on_consume_effects": [
        {
          "type": "apply_effects",
          "effects": [
            {
              "id": "regeneration",
              "duration": 200,
              "amplifier": 1
            }
          ],
          "probability": 1.0
        }
      ]
    },
    "food": {
      "nutrition": 4,
      "saturation": 2.4,
      "can_always_eat": true
    }
  }
}
```

### Why Both Are Needed

- **Before 1.21.2**: The `food` component alone made items edible
- **1.21.2+**: Food system was split:
  - `consumable` = ability to eat/drink
  - `food` = nutrition stats only

**Without `consumable`, food items CANNOT be eaten, even with `can_always_eat: true`**

---

## Multi-Colored Lore (Single Line)

Lore supports both single text components per line AND arrays of text components for multi-colored text on a single line:

### Single Color Per Line (Normal)

```json
"lore": [
  {"text": "Line 1", "color": "red"},
  {"text": "Line 2", "color": "blue"}
]
```

### Multi-Colored Single Line (NEW)

```json
"lore": [
  {"text": "Normal single-color line", "color": "gray"},
  [
    {"text": "This is ", "color": "white"},
    {"text": "multi-colored", "color": "gold", "bold": true},
    {"text": " text on one line", "color": "white"}
  ],
  {"text": "Another normal line", "color": "green"}
]
```

### Gradient Example

```json
"lore": [
  [
    {"text": "G", "color": "#ff0000"},
    {"text": "r", "color": "#ff3300"},
    {"text": "a", "color": "#ff6600"},
    {"text": "d", "color": "#ff9900"},
    {"text": "i", "color": "#ffcc00"},
    {"text": "e", "color": "#ffff00"},
    {"text": "n", "color": "#ccff00"},
    {"text": "t", "color": "#99ff00"}
  ]
]
```

**Usage:** Use arrays `[]` when you want multiple colors/styles on a single line. Use objects `{}` for normal single-color lines.

---

## Quick Reference: Common Components

### Consumable (For Food/Potions/Etc.)

```json
"consumable": {
  "consume_seconds": 1.6,
  "animation": "eat",
  "has_consume_particles": true,
  "on_consume_effects": [
    {
      "type": "apply_effects",
      "effects": [
        {"id": "effect_id", "duration": 200, "amplifier": 0}
      ],
      "probability": 1.0
    }
  ]
}
```

**Consume Effect Types:**

- `apply_effects` - Apply potion effects
- `remove_effects` - Remove specific effects
- `clear_all_effects` - Remove all effects
- `teleport_randomly` - Random teleport
- `play_sound` - Play a sound

**Animations:**

- `eat`, `drink`, `none`, `block`, `bow`, `spear`, `crossbow`, `spyglass`, `toot_horn`, `brush`, `bundle`, `trident`

### Food Stats

```json
"food": {
  "nutrition": 8,
  "saturation": 1.2,
  "can_always_eat": true
}
```

### Weapons & Combat

If the item requires combat functionality, you must adhere to the following components

```json
"weapon": {
  "item_damage_per_attack": 1,
  "disable_blocking_for_seconds": 5
}
```

```json
"attack_range": {
  "max_reach": 5.0,
  "hitbox_margin": 0.3
}
```

```json
"damage_type": "minecraft:campfire"
```

### Tools

If the item requires tool functionality, you must adhere to the following components

```json
"tool": {
  "default_mining_speed": 4.0,
  "damage_per_block": 1,
  "rules": [
    {
      "blocks": "#minecraft:mineable/pickaxe",
      "speed": 8.0,
      "correct_for_drops": true
    }
  ]
}
```

### Equipment

```json
"equippable": {
  "slot": "head",
  "equip_sound": "item.armor.equip_iron",
  "asset_id": "minecraft:diamond",
  "dispensable": true,
  "swappable": true
}
```

### Durability

```json
"max_damage": 1000,
"damage": 0,
"unbreakable": {}
```

### Visual Effects

```json
"item_model": "minecraft:diamond_sword",
"custom_model_data": {
  "floats": [1.0, 2.0],
  "strings": ["variant_1"],
  "colors": [16711680]
},
"dyed_color": 8388403,
"enchantment_glint_override": true
```

---

## Complete Working Examples

### Food Item (All Properties)

```json
{
  "id": "super_apple",
  "texture": "apple",
  "tags": ["minecraft:foods"],
  "components": {
    "max_stack_size": 64,
    "rarity": "epic",
    "custom_name": {
      "text": "Super Apple",
      "color": "gold",
      "bold": true
    },
    "lore": [
      { "text": "The ultimate food", "italic": false, "color": "gray" },
      [
        { "text": "Restores ", "italic": false },
        { "text": "20 hunger", "italic": false, "color": "gold", "bold": true },
        { "text": " instantly", "italic": false }
      ]
    ],
    "consumable": {
      "consume_seconds": 1.6,
      "animation": "eat",
      "has_consume_particles": true,
      "on_consume_effects": [
        {
          "type": "apply_effects",
          "effects": [
            { "id": "regeneration", "duration": 200, "amplifier": 2 },
            { "id": "absorption", "duration": 2400, "amplifier": 3 }
          ],
          "probability": 1.0
        }
      ]
    },
    "food": {
      "nutrition": 10,
      "saturation": 2.0,
      "can_always_eat": true
    },
    "enchantment_glint_override": true
  }
}
```

### Weapon (All Properties)

```json
{
  "id": "mega_sword",
  "texture": "netherite_sword",
  "tags": ["minecraft:swords"],
  "components": {
    "max_stack_size": 1,
    "max_damage": 5000,
    "rarity": "epic",
    "custom_name": {
      "text": "Blade of Destruction",
      "color": "dark_red",
      "bold": true
    },
    "weapon": {
      "item_damage_per_attack": 1,
      "disable_blocking_for_seconds": 10
    },
    "attack_range": {
      "max_reach": 6.0
    },
    "attribute_modifiers": [
      {
        "type": "attack_damage",
        "amount": 200,
        "operation": "add_value",
        "id": "ner:mega_damage",
        "slot": "mainhand"
      },
      {
        "type": "attack_speed",
        "amount": 10,
        "operation": "add_value",
        "id": "ner:mega_speed",
        "slot": "mainhand"
      }
    ],
    "enchantments": {
      "sharpness": 10,
      "unbreaking": 10,
      "mending": 1
    },
    "unbreakable": {}
  }
}
```

### Armor (All Properties)

```json
{
  "id": "super_boots",
  "texture": "diamond_boots",
  "tags": ["minecraft:boots"],
  "components": {
    "max_stack_size": 1,
    "max_damage": 1000,
    "rarity": "rare",
    "equippable": {
      "slot": "feet",
      "equip_sound": "item.armor.equip_diamond",
      "asset_id": "minecraft:netherite"
    },
    "attribute_modifiers": [
      {
        "type": "movement_speed",
        "amount": 3.0,
        "operation": "add_multiplied_base",
        "id": "ner:speed_boost",
        "slot": "feet"
      },
      {
        "type": "armor",
        "amount": 10,
        "operation": "add_value",
        "id": "ner:armor_boost",
        "slot": "feet"
      }
    ],
    "trim": {
      "pattern": "vex",
      "material": "netherite"
    },
    "dyed_color": 65535
  }
}
```

---

## All Supported Components (Minecraft 1.21.11)

### Basic Properties

- `max_stack_size` (1-99)
- `max_damage` (durability)
- `damage` (current damage)
- `rarity` (common/uncommon/rare/epic)
- `unbreakable`
- `repair_cost`

### Display

- `custom_name` (text component)
- `item_name` (text component)
- `lore` (array of text components OR arrays for multi-colored lines, max 256)
- `item_model` (override model)
- `custom_model_data` (floats, flags, strings, colors)
- `enchantment_glint_override` (boolean)
- `dyed_color` (integer or RGB array)

### Combat & Tools

- `weapon` (damage per attack, shield disable)
- `tool` (mining speed, damage per block, rules)
- `attack_range` (reach, hitbox)
- `attribute_modifiers` (stats)
- `damage_type` (damage source)
- `piercing_weapon` (pierce multiple entities)
- `kinetic_weapon` (velocity-based damage)
- `blocks_attacks` (shield behavior)
- `minimum_attack_charge` (attack cooldown)
- `swing_animation` (whack/stab/none)

### Enchantments

- `enchantments` (active enchantments)
- `stored_enchantments` (for enchanted books)
- `enchantable` (can be enchanted in table)

### Consumables & Food

- **`consumable`** (REQUIRED for eating/drinking)
- `food` (nutrition stats)
- `potion_contents` (potion effects)
- `potion_duration_scale` (effect duration multiplier)
- `suspicious_stew_effects` (stew effects)
- `ominous_bottle_amplifier` (bad omen level)
- `use_remainder` (item after use, e.g., bowl)
- `use_cooldown` (cooldown after use)
- `use_effects` (movement penalties when using)

### Equipment & Armor

- `equippable` (slot, sounds, model, dispensing)
- `trim` (armor trim)
- `glider` (elytra behavior)
- `death_protection` (totem effect)

### Containers & Storage

- `container` (items in container)
- `container_loot` (loot table)
- `bundle_contents` (bundle items)
- `lock` (container lock)

### Projectiles & Ranged

- `charged_projectiles` (crossbow ammo)
- `intangible_projectile` (can't be picked up)

### Special Items

- `fireworks` (rocket properties)
- `firework_explosion` (star properties)
- `banner_patterns` (banner/shield patterns)
- `base_color` (shield base color)
- `pot_decorations` (pottery sherds)
- `jukebox_playable` (music disc)
- `instrument` (goat horn sound)
- `map_id`, `map_color`, `map_decorations` (maps)
- `lodestone_tracker` (compass tracking)
- `profile` (player head)
- `note_block_sound` (note block sound)

### Books

- `writable_book_content` (book & quill)
- `written_book_content` (written book)
- `recipes` (knowledge book)

### Blocks & Entities

- `block_state` (force block state)
- `block_entity_data` (NBT when placed)
- `entity_data` (entity NBT when spawned)
- `bucket_entity_data` (mob bucket data)
- `bees` (beehive bees)

### Adventure Mode

- `can_break` (blocks to break)
- `can_place_on` (blocks to place on)

### Misc

- `custom_data` (custom NBT for mods)
- `damage_resistant` (fire resistant, etc.)
- `repairable` (repair materials)
- `tooltip_style` (custom tooltip)
- `debug_stick_state` (debug stick)

---

## Block Properties

Blocks have `properties` for physical behavior (separate from components):

```json
"properties": {
  "hardness": 3.0,
  "resistance": 3.0,
  "requires_correct_tool": true,
  "light_level": 15,
  "friction": 0.6,
  "speed_factor": 1.0,
  "jump_factor": 1.0,
  "sound_type": "stone",
  "no_occlusion": false,
  "no_collision": false
}
```

Block `components` apply to the BlockItem (what you hold in inventory).

---

## Block Drops

Blocks can define custom drops with the `drops` property:

```json
{
  "id": "rich_gold_ore",
  "texture": "gold_ore",
  "properties": {
    "requires_correct_tool": true
  },
  "drops": [
    {
      "item": "ner:ruby",
      "min": 2,
      "max": 4
    }
  ]
}
```

**✨ Custom Item Support:** When you drop a custom NER item (like `"ner:ruby"`), the dropped item **automatically includes all its configured properties**:

- Custom name ("Cursed Ruby")
- Multi-colored lore
- Attribute modifiers (+4 Max Health, -30% Movement Speed)
- Enchantment glint
- All other components

**Drop Properties:**

- `item` (required): Item ID (e.g., `"minecraft:diamond"`, `"ner:ruby"`)
- `count`: Exact amount (default: 1)
- `min`/`max`: Random range (overrides count)
- `chance`: Probability 0.0-1.0 (default: 1.0 = always)

**See BLOCK_DROPS.md for complete documentation and examples!**

---

## Important Notes for LLM Generation

1. **Food items REQUIRE both `consumable` AND `food` components**
2. **Effects go in `consumable.on_consume_effects`, NOT `food.effects`**
3. **`can_always_eat` only works when both components are present**
4. **Attributes in 1.21.11 NO LONGER use prefixes** - Use `"max_health"` NOT `"generic.max_health"`
5. **Text components use JSON objects, not strings**
6. **All Minecraft 1.21.11 data components are supported**
7. **Max stack size and max damage cannot both be > 1**
8. **Tags are bound to the item/block, not just metadata**
9. **Lore supports multi-colored lines** - Use arrays for multiple colors on one line

# Minecraft 1.21.11 Attributes Reference

Complete guide to all attributes in Minecraft 1.21.11 for item and entity customization.

## IMPORTANT: 1.21.11 Changes

**In Minecraft 1.21.11, attribute names NO LONGER use the `generic.`, `player.`, or `zombie.` prefixes.**

### ❌ OLD (Before 1.21.11):

```json
"type": "generic.max_health"
"type": "generic.movement_speed"
"type": "player.block_interaction_range"
```

### ✅ NEW (1.21.11+):

```json
"type": "max_health"
"type": "movement_speed"
"type": "block_interaction_range"
```

**All examples in this guide use the NEW 1.21.11 format.**

---

## Table of Contents

1. [How to Use Attributes](#how-to-use-attributes)
2. [Operations](#operations)
3. [Complete Attribute List](#complete-attribute-list)
4. [Common Use Cases](#common-use-cases)
5. [Examples](#examples)

---

## How to Use Attributes

Attributes are added to items via the `attribute_modifiers` component:

```json
{
  "id": "custom_item",
  "texture": "diamond",
  "components": {
    "attribute_modifiers": [
      {
        "type": "max_health",
        "amount": 10,
        "operation": "add_value",
        "id": "ner:health_boost",
        "slot": "mainhand"
      }
    ]
  }
}
```

### Required Fields

- **`type`**: Attribute name (see list below)
- **`amount`**: Numeric value (positive or negative)
- **`operation`**: How the value is applied (see [Operations](#operations))
- **`id`**: Unique identifier (e.g., `"ner:custom_modifier"`)
- **`slot`**: Where item must be equipped

### Slot Options

- `any` - Any equipment slot
- `hand` - Either hand
- `mainhand` - Main hand only
- `offhand` - Off hand only
- `armor` - Any armor slot
- `head` - Helmet slot
- `chest` - Chestplate slot
- `legs` - Leggings slot
- `feet` - Boots slot
- `body` - Body slot (horse armor, wolf armor)
- `saddle` - Saddle slot

---

## Operations

Operations determine how the attribute modifier is applied:

### 1. `add_value`

Adds the amount directly to the base value.

**Formula:** `Total = Base + Amount₁ + Amount₂ + ... + Amountₙ`

**Example:** Base 10 + Modifier 5 = **15**

**Use for:** Direct stat increases (health, damage, armor)

### 2. `add_multiplied_base`

Multiplies base by `(1 + sum of all amounts)`.

**Formula:** `Total = Base × (1 + Amount₁ + Amount₂ + ... + Amountₙ)`

**Example:** Base 10 × (1 + 0.5) = **15**

**Use for:** Percentage bonuses that stack additively (movement speed, attack speed)

### 3. `add_multiplied_total`

Multiplies separately for each modifier.

**Formula:** `Total = Base × (1 + Amount₁) × (1 + Amount₂) × ... × (1 + Amountₙ)`

**Example:** Base 10 × (1 + 0.5) × (1 + 0.3) = **19.5**

**Use for:** Compounding percentage bonuses

---

## Complete Attribute List

### ⚔️ Combat Attributes

#### `armor`

**Default:** 0 | **Min:** 0 | **Max:** 30

Armor defense points (each armor icon = 2 points).

```json
{ "type": "armor", "amount": 10, "operation": "add_value" }
```

#### `armor_toughness`

**Default:** 0 | **Min:** 0 | **Max:** 20

Reduces damage from high-damage attacks.

```json
{ "type": "armor_toughness", "amount": 4, "operation": "add_value" }
```

#### `attack_damage`

**Default:** 2 (1❤️) | **Min:** 0 | **Max:** 2048

Damage dealt per attack (in half-hearts).

```json
{ "type": "attack_damage", "amount": 10, "operation": "add_value" }
```

#### `attack_speed`

**Default:** 4 | **Min:** 0 | **Max:** 1024

Full-strength attacks per second (higher = faster cooldown).

```json
{ "type": "attack_speed", "amount": 2, "operation": "add_value" }
```

#### `attack_knockback`

**Default:** 0 | **Min:** 0 | **Max:** 5

Knockback applied to attacks.

```json
{ "type": "attack_knockback", "amount": 2, "operation": "add_value" }
```

#### `attack_range`

**Default:** 2.5 | **Min:** 0 | **Max:** 6

Reach distance for melee attacks (in blocks).

```json
{ "type": "attack_range", "amount": 1.5, "operation": "add_value" }
```

---

### 🛡️ Defense Attributes

#### `knockback_resistance`

**Default:** 0 | **Min:** 0 | **Max:** 1

Resistance to knockback (0 = 0%, 1 = 100% resistance).

```json
{ "type": "knockback_resistance", "amount": 0.5, "operation": "add_value" }
```

#### `explosion_knockback_resistance`

**Default:** 0 | **Min:** 0 | **Max:** 1

Resistance to explosion knockback specifically.

```json
{
  "type": "explosion_knockback_resistance",
  "amount": 1,
  "operation": "add_value"
}
```

#### `damage_resistant`

**Note:** This is handled via a separate component, not attribute_modifiers. See [damage_resistant component](#special-resistance).

---

### ❤️ Health & Survival

#### `max_health`

**Default:** 20 (10❤️) | **Min:** 1 (0.5❤️) | **Max:** 1024

Maximum health (in half-hearts).

```json
{ "type": "max_health", "amount": 20, "operation": "add_value" }
```

#### `max_absorption`

**Default:** 0 | **Min:** 0 | **Max:** 2048

Maximum absorption hearts from Absorption effect.

```json
{ "type": "max_absorption", "amount": 16, "operation": "add_value" }
```

#### `safe_fall_distance`

**Default:** 3 | **Min:** -1024 | **Max:** 1024

Blocks you can fall without taking damage.

```json
{ "type": "safe_fall_distance", "amount": 2, "operation": "add_value" }
```

#### `fall_damage_multiplier`

**Default:** 1 | **Min:** 0 | **Max:** 100

Fall damage multiplier (0 = no fall damage).

```json
{ "type": "fall_damage_multiplier", "amount": 0.5, "operation": "add_value" }
```

---

### 🏃 Movement Attributes

#### `movement_speed`

**Default:** 0.1 (player) | **Min:** 0 | **Max:** 1024

Movement speed (actual blocks/sec ≈ value × 21.6).

```json
{ "type": "movement_speed", "amount": 0.05, "operation": "add_value" }
```

**Speed Reference:**

- 0.1 = Normal walking (player default)
- 0.13 = Sprinting (0.1 × 1.3)
- 0.2 = Fast movement
- 0.05 = Slow movement
- -0.5 (multiplied_base) = 50% slower

#### `flying_speed`

**Default:** 0.4 | **Min:** 0 | **Max:** 1024

Flying speed in creative/spectator mode.

```json
{ "type": "flying_speed", "amount": 0.2, "operation": "add_value" }
```

#### `sneaking_speed`

**Default:** 0.3 | **Min:** 0 | **Max:** 1

Movement speed multiplier while sneaking (0.3 = 30% of normal).

```json
{ "type": "sneaking_speed", "amount": 0.2, "operation": "add_value" }
```

#### `jump_strength`

**Default:** 0.42 | **Min:** 0 | **Max:** 32

Initial vertical velocity when jumping (in blocks/tick).

```json
{ "type": "jump_strength", "amount": 0.2, "operation": "add_value" }
```

#### `step_height`

**Default:** 0.6 | **Min:** 0 | **Max:** 10

Maximum blocks to step up without jumping.

```json
{ "type": "step_height", "amount": 0.4, "operation": "add_value" }
```

#### `gravity`

**Default:** 0.08 | **Min:** -1 | **Max:** 1

Gravity affecting entity (blocks/tick²). Negative = upward.

```json
{ "type": "gravity", "amount": -0.04, "operation": "add_value" }
```

---

### 🎯 Interaction & Range

#### `block_interaction_range`

**Default:** 4.5 | **Min:** 0 | **Max:** 64

Block interaction distance (in blocks). +0.5 bonus in Creative.

```json
{ "type": "block_interaction_range", "amount": 2, "operation": "add_value" }
```

#### `entity_interaction_range`

**Default:** 3 | **Min:** 0 | **Max:** 64

Entity interaction distance (in blocks). +2 bonus in Creative.

```json
{ "type": "entity_interaction_range", "amount": 3, "operation": "add_value" }
```

#### `follow_range`

**Default:** 32 (varies by mob) | **Min:** 0 | **Max:** 2048

Range mobs can detect and follow targets (in blocks).

```json
{ "type": "follow_range", "amount": 64, "operation": "add_value" }
```

---

### ⛏️ Mining & Breaking

#### `block_break_speed`

**Default:** 1 | **Min:** 0 | **Max:** 1024

Block breaking speed multiplier.

```json
{ "type": "block_break_speed", "amount": 2, "operation": "add_multiplied_base" }
```

#### `mining_efficiency`

**Default:** 0 | **Min:** 0 | **Max:** 1024

Mining speed bonus when using correct tool.

```json
{ "type": "mining_efficiency", "amount": 10, "operation": "add_value" }
```

#### `submerged_mining_speed`

**Default:** 0.2 | **Min:** 0 | **Max:** 20

Mining speed multiplier underwater (0.2 = 20% speed, 1 = full speed).

```json
{ "type": "submerged_mining_speed", "amount": 0.8, "operation": "add_value" }
```

---

### 🌊 Water & Environment

#### `oxygen_bonus`

**Default:** 0 | **Min:** 0 | **Max:** 1024

Reduces oxygen consumption underwater. Chance = 1/(oxygen_bonus + 1).

```json
{ "type": "oxygen_bonus", "amount": 3, "operation": "add_value" }
```

#### `water_movement_efficiency`

**Default:** 0 | **Min:** 0 | **Max:** 1

Movement speed boost in water (0 = slow, 1 = normal land speed).

```json
{ "type": "water_movement_efficiency", "amount": 0.5, "operation": "add_value" }
```

#### `movement_efficiency`

**Default:** 0 | **Min:** 0 | **Max:** 1

Reduces slowdown from terrain (soul sand, honey, etc). 1 = no slowdown.

```json
{ "type": "movement_efficiency", "amount": 1, "operation": "add_value" }
```

---

### 🔥 Special Mechanics

#### `burning_time`

**Default:** 1 | **Min:** 0 | **Max:** 1024

Fire duration multiplier (0 = instant extinguish).

```json
{ "type": "burning_time", "amount": 0, "operation": "add_value" }
```

#### `scale`

**Default:** 1 | **Min:** 0.0625 | **Max:** 16

Entity size multiplier (visual and hitbox).

```json
{ "type": "scale", "amount": 0.5, "operation": "add_multiplied_base" }
```

#### `luck`

**Default:** 0 | **Min:** -1024 | **Max:** 1024

Affects loot table quality (fishing, chests, mob drops).

```json
{ "type": "luck", "amount": 5, "operation": "add_value" }
```

#### `sweeping_damage_ratio`

**Default:** 0 | **Min:** 0 | **Max:** 1

Damage transferred to sweep attack targets (0-1 = 0%-100%).

```json
{ "type": "sweeping_damage_ratio", "amount": 0.5, "operation": "add_value" }
```

---

### 🎮 Player-Specific

#### `camera_distance`

**Default:** 4 | **Min:** 0 | **Max:** 32

Third-person camera distance (in blocks).

```json
{ "type": "camera_distance", "amount": 4, "operation": "add_value" }
```

#### `tempt_range`

**Default:** 10 | **Min:** 0 | **Max:** 2024

Range animals can be tempted with food (in blocks).

```json
{ "type": "tempt_range", "amount": 20, "operation": "add_value" }
```

#### `waypoint_receive_range`

**Default:** 60,000,000 (player) | **Min:** 0 | **Max:** 60,000,000

Max distance to receive waypoint markers on locator bar.

```json
{ "type": "waypoint_receive_range", "amount": 10000, "operation": "add_value" }
```

#### `waypoint_transmit_range`

**Default:** 60,000,000 (player) | **Min:** 0 | **Max:** 60,000,000

Distance at which entity shows as waypoint on locator bar.

```json
{ "type": "waypoint_transmit_range", "amount": 5000, "operation": "add_value" }
```

---

### 🧟 Mob-Specific

#### `spawn_reinforcements`

**Default:** 0 | **Min:** 0 | **Max:** 1

Chance for zombies to spawn reinforcements when attacked.

```json
{ "type": "spawn_reinforcements", "amount": 0.5, "operation": "add_value" }
```

---

## Common Use Cases

### 🗡️ Weapons

#### High Damage Sword

```json
"attribute_modifiers": [
  {
    "type": "attack_damage",
    "amount": 50,
    "operation": "add_value",
    "id": "ner:mega_damage",
    "slot": "mainhand"
  },
  {
    "type": "attack_speed",
    "amount": 10,
    "operation": "add_value",
    "id": "ner:fast_attack",
    "slot": "mainhand"
  }
]
```

#### Long Range Weapon

```json
"attribute_modifiers": [
  {
    "type": "attack_damage",
    "amount": 20,
    "operation": "add_value",
    "id": "ner:damage",
    "slot": "mainhand"
  },
  {
    "type": "attack_range",
    "amount": 3,
    "operation": "add_value",
    "id": "ner:range",
    "slot": "mainhand"
  }
]
```

---

### 🛡️ Armor

#### Tank Armor

```json
"attribute_modifiers": [
  {
    "type": "max_health",
    "amount": 40,
    "operation": "add_value",
    "id": "ner:health",
    "slot": "chest"
  },
  {
    "type": "armor",
    "amount": 10,
    "operation": "add_value",
    "id": "ner:armor",
    "slot": "chest"
  },
  {
    "type": "knockback_resistance",
    "amount": 0.5,
    "operation": "add_value",
    "id": "ner:kb_resist",
    "slot": "chest"
  }
]
```

#### Speed Boots

```json
"attribute_modifiers": [
  {
    "type": "movement_speed",
    "amount": 0.5,
    "operation": "add_multiplied_base",
    "id": "ner:speed",
    "slot": "feet"
  },
  {
    "type": "step_height",
    "amount": 0.5,
    "operation": "add_value",
    "id": "ner:step",
    "slot": "feet"
  }
]
```

---

### 🎭 Special Items

#### Miner's Helmet

```json
"attribute_modifiers": [
  {
    "type": "mining_efficiency",
    "amount": 20,
    "operation": "add_value",
    "id": "ner:mining",
    "slot": "head"
  },
  {
    "type": "block_break_speed",
    "amount": 1,
    "operation": "add_multiplied_base",
    "id": "ner:break_speed",
    "slot": "head"
  }
]
```

#### Water Breathing Charm

```json
"attribute_modifiers": [
  {
    "type": "oxygen_bonus",
    "amount": 99,
    "operation": "add_value",
    "id": "ner:oxygen",
    "slot": "hand"
  },
  {
    "type": "water_movement_efficiency",
    "amount": 1,
    "operation": "add_value",
    "id": "ner:water_move",
    "slot": "hand"
  },
  {
    "type": "submerged_mining_speed",
    "amount": 0.8,
    "operation": "add_value",
    "id": "ner:water_mine",
    "slot": "hand"
  }
]
```

#### Feather Falling Boots

```json
"attribute_modifiers": [
  {
    "type": "safe_fall_distance",
    "amount": 50,
    "operation": "add_value",
    "id": "ner:safe_fall",
    "slot": "feet"
  },
  {
    "type": "fall_damage_multiplier",
    "amount": -0.8,
    "operation": "add_value",
    "id": "ner:fall_reduce",
    "slot": "feet"
  }
]
```

#### Giant's Ring (Size Modifier)

```json
"attribute_modifiers": [
  {
    "type": "scale",
    "amount": 1,
    "operation": "add_multiplied_base",
    "id": "ner:giant",
    "slot": "hand"
  },
  {
    "type": "max_health",
    "amount": 40,
    "operation": "add_value",
    "id": "ner:giant_health",
    "slot": "hand"
  }
]
```

#### Cursed Item (Trade-offs)

```json
"attribute_modifiers": [
  {
    "type": "attack_damage",
    "amount": 100,
    "operation": "add_value",
    "id": "ner:power",
    "slot": "mainhand"
  },
  {
    "type": "movement_speed",
    "amount": -0.5,
    "operation": "add_multiplied_base",
    "id": "ner:curse_slow",
    "slot": "mainhand"
  },
  {
    "type": "max_health",
    "amount": -10,
    "operation": "add_value",
    "id": "ner:curse_health",
    "slot": "mainhand"
  }
]
```

---

## Complete Item Examples

### Berserker Axe

```json
{
  "id": "berserker_axe",
  "texture": "netherite_axe",
  "components": {
    "rarity": "epic",
    "custom_name": {
      "text": "Berserker's Rage",
      "color": "dark_red",
      "bold": true
    },
    "lore": [
      { "text": "Power comes at a price", "italic": false, "color": "gray" }
    ],
    "attribute_modifiers": [
      {
        "type": "attack_damage",
        "amount": 100,
        "operation": "add_value",
        "id": "ner:berserker_damage",
        "slot": "mainhand"
      },
      {
        "type": "attack_speed",
        "amount": -0.5,
        "operation": "add_multiplied_base",
        "id": "ner:berserker_slow",
        "slot": "mainhand"
      },
      {
        "type": "movement_speed",
        "amount": 0.3,
        "operation": "add_multiplied_base",
        "id": "ner:berserker_speed",
        "slot": "mainhand"
      }
    ]
  }
}
```

### Aqua Helmet

```json
{
  "id": "aqua_helmet",
  "texture": "diamond_helmet",
  "components": {
    "rarity": "rare",
    "custom_name": {
      "text": "Aqua Helmet",
      "color": "aqua"
    },
    "dyed_color": 65535,
    "attribute_modifiers": [
      {
        "type": "oxygen_bonus",
        "amount": 999,
        "operation": "add_value",
        "id": "ner:infinite_breath",
        "slot": "head"
      },
      {
        "type": "water_movement_efficiency",
        "amount": 1,
        "operation": "add_value",
        "id": "ner:water_speed",
        "slot": "head"
      },
      {
        "type": "submerged_mining_speed",
        "amount": 0.8,
        "operation": "add_value",
        "id": "ner:water_mining",
        "slot": "head"
      }
    ]
  }
}
```

---

## Special: Damage Resistant Component

The `damage_resistant` attribute is NOT part of `attribute_modifiers`. It's a separate component:

```json
{
  "id": "fire_proof_item",
  "texture": "netherite_ingot",
  "components": {
    "damage_resistant": {
      "types": "#minecraft:is_fire"
    }
  }
}
```

**Common Damage Type Tags:**

- `#minecraft:is_fire` - Fire and lava
- `#minecraft:is_explosion` - All explosions
- `#minecraft:is_projectile` - Arrows, tridents, etc.
- `#minecraft:bypasses_armor` - Damage that ignores armor

---

## Tips for LLM Generation

1. **No prefixes**: Use `"max_health"`, NOT `"generic.max_health"`
2. **Slot matters**: Choose appropriate slot for the item type
3. **Unique IDs**: Always use unique `id` values (e.g., `"ner:unique_name"`)
4. **Operations**:
   - Use `add_value` for flat bonuses
   - Use `add_multiplied_base` for percentage bonuses
   - Use `add_multiplied_total` for compounding bonuses
5. **Balance**: Consider trade-offs (high damage but slow speed)
6. **Combinations**: Multiple attributes create interesting items

# Block Drops Guide

Comprehensive guide for defining custom block drops in Minecraft 1.21.11.

## Overview

The `drops` property allows you to define what items a block drops when mined. This works seamlessly with the `requires_correct_tool` property - if set to `true`, the drops will only happen when mined with the correct tool.

**✨ Custom NER Items:** When you specify a custom NER item (e.g., `"ner:ruby"`), the drop will **automatically include all the item's custom properties** - name, lore, attributes, enchantments, etc. No extra configuration needed!

## Basic Format

```json
{
  "id": "custom_ore",
  "texture": "diamond_ore",
  "properties": {
    "requires_correct_tool": true
  },
  "drops": [
    {
      "item": "minecraft:diamond",
      "count": 2
    }
  ]
}
```

## Drop Properties

### Required

- **`item`** (string): Item ID to drop
  - Format: `"minecraft:diamond"` or `"ner:custom_item"`
  - Must be a valid registered item

### Optional

- **`count`** (integer, default: 1): Exact number to drop
  - Used when you want a fixed amount
  - Ignored if `min`/`max` are specified

- **`min`** (integer): Minimum count for random range
  - Requires `max` to be set
  - Overrides `count`

- **`max`** (integer): Maximum count for random range
  - Requires `min` to be set
  - Overrides `count`

- **`chance`** (number, 0.0-1.0, default: 1.0): Probability of drop
  - `1.0` = 100% chance (always drops)
  - `0.5` = 50% chance
  - `0.1` = 10% chance
  - Checked independently for each drop entry

## Examples

### Fixed Count

Drops exactly 2 diamonds every time:

```json
"drops": [
  {
    "item": "minecraft:diamond",
    "count": 2
  }
]
```

### Custom NER Items with Full Properties

Drops your custom ruby item with all its attributes, name, lore, etc.:

```json
"drops": [
  {
    "item": "ner:ruby",
    "min": 2,
    "max": 4
  }
]
```

**Result:** Each ruby dropped will have:


- **`item`** (string): Item ID to drop
  - Format: `"minecraft:diamond"` or `"ner:custom_item"`
  - Must be a valid registered item

### Optional

- **`count`** (integer, default: 1): Exact number to drop
  - Used when you want a fixed amount
  - Ignored if `min`/`max` are specified

- **`min`** (integer): Minimum count for random range
  - Requires `max` to be set
  - Overrides `count`

- **`max`** (integer): Maximum count for random range
  - Requires `min` to be set
  - Overrides `count`

- **`chance`** (number, 0.0-1.0, default: 1.0): Probability of drop
  - `1.0` = 100% chance (always drops)
  - `0.5` = 50% chance
  - `0.1` = 10% chance
  - Checked independently for each drop entry

## Examples

### Fixed Count

Drops exactly 2 diamonds every time:

```json
"drops": [
  {
    "item": "minecraft:diamond",
    "count": 2
  }
]
```

### Custom NER Items with Full Properties

Drops your custom ruby item with all its attributes, name, lore, etc.:

```json
"drops": [
  {
    "item": "ner:ruby",
    "min": 2,
    "max": 4
  }
]
```

**Result:** Each ruby dropped will have:

- Custom name ("Cursed Ruby")
- Multi-colored lore
- Attribute modifiers (+4 Max Health, -30% Movement Speed)
- Enchantment glint
- All other configured components

### Random Range

Drops between 1 and 3 emeralds:

```json
"drops": [
  {
    "item": "minecraft:emerald",
    "min": 1,
    "max": 3
  }
]
```

### Probability Drops

25% chance to drop a rare gem:

```json
"drops": [
  {
    "item": "ner:rare_gem",
    "count": 1,
    "chance": 0.25
  }
]
```

### Multiple Drops

Drops both diamonds AND has a chance for emeralds:

```json
"drops": [
  {
    "item": "minecraft:diamond",
    "min": 1,
    "max": 2
  },
  {
    "item": "minecraft:emerald",
    "count": 1,
    "chance": 0.3
  }
]
```
