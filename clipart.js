/**
 * Botanical Clip Art Manifest for Vintage Seed Envelopes
 * Each entry provides vector artwork designed in an antique woodcut/botanical lithograph style,
 * along with botanical metadata to auto-populate the form.
 */

const CLIP_ART_MANIFEST = [
  {
    id: "none",
    name: "None (Blank)",
    commonName: "",
    latinName: "",
    variety: "",
    notes: "",
    svg: ""
  },
  {
    id: "tomato",
    name: "Tomato",
    commonName: "Tomato",
    latinName: "Solanum lycopersicum",
    variety: "Brandywine Heirloom",
    notes: "Indeterminate vine, rich full flavor. Save seeds by fermenting 3 days.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stem and Calyx -->
        <path d="M50 15 C51 22 50 26 50 30" stroke-width="2.5" />
        <path d="M50 30 C45 27 38 27 34 30 C39 32 45 32 50 32" fill="currentColor" fill-opacity="0.15" stroke-width="1.2" />
        <path d="M50 30 C55 27 62 27 66 30 C61 32 55 32 50 32" fill="currentColor" fill-opacity="0.15" stroke-width="1.2" />
        <path d="M50 30 C48 35 44 40 40 43 C44 38 47 34 50 32" fill="currentColor" fill-opacity="0.15" stroke-width="1.2" />
        <path d="M50 30 C52 35 56 40 60 43 C56 38 53 34 50 32" fill="currentColor" fill-opacity="0.15" stroke-width="1.2" />
        <path d="M50 30 C50 36 50 41 50 44 C49 39 49 34 50 32" fill="currentColor" stroke-width="1.2" />
        <!-- Tomato Body -->
        <path d="M50 32 C38 31 22 38 20 54 C18 69 29 82 45 84 C48 84.5 52 84.5 55 84 C71 82 82 69 80 54 C78 38 62 31 50 32 Z" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
        <!-- Lobes and Ribs (Heirloom creases) -->
        <path d="M37 34 C33 42 32 56 34 70 C36 76 40 81 44 83" stroke-width="1.2" />
        <path d="M63 34 C67 42 68 56 66 70 C64 76 60 81 56 83" stroke-width="1.2" />
        <path d="M49 33 C48 45 48 65 50 84" stroke-width="1" stroke-dasharray="3 1.5" />
        <!-- Woodcut hatching shading -->
        <path d="M23 60 C26 67 31 73 38 77" stroke-width="0.8" />
        <path d="M25 54 C28 62 32 68 37 72" stroke-width="0.8" />
        <path d="M27 48 C30 54 34 60 38 65" stroke-width="0.8" />
        <path d="M77 60 C74 67 69 73 62 77" stroke-width="0.8" />
        <path d="M75 54 C72 62 68 68 63 72" stroke-width="0.8" />
        <path d="M73 48 C70 54 66 60 62 65" stroke-width="0.8" />
        <!-- Tomato blossom / leaf accent -->
        <path d="M52 17 C57 14 65 15 70 19 C64 21 57 20 52 17 Z" fill="currentColor" fill-opacity="0.2" stroke-width="1" />
      </g>
    `
  },
  {
    id: "carrot",
    name: "Carrot",
    commonName: "Carrot",
    latinName: "Daucus carota subsp. sativus",
    variety: "Danvers Half Long",
    notes: "Sweet crisp orange taproot. Sow directly in loose, stone-free loam.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Feathery Foliage -->
        <path d="M48 35 C46 25 42 16 36 10 M40 19 C34 16 30 18 26 15 M43 25 C37 23 32 26 28 24 M46 14 C48 10 52 7 57 6" stroke-width="1.2" />
        <path d="M50 35 C50 23 52 14 53 8 M51 22 C56 18 60 20 65 17 M51 28 C57 26 62 29 67 27 M52 15 C50 11 48 7 44 5" stroke-width="1.2" />
        <path d="M52 35 C56 26 61 18 68 12 M57 24 C63 21 68 23 74 21 M54 30 C60 28 66 31 71 30" stroke-width="1.2" />
        <!-- Crown -->
        <path d="M38 36 C42 34 58 34 62 36 C63 38 61 40 50 40 C39 40 37 38 38 36 Z" fill="currentColor" fill-opacity="0.2" stroke-width="1.5" />
        <!-- Taproot Body -->
        <path d="M38 37 C39 45 42 62 47 82 C48 87 49 92 50 94 C51 92 52 87 53 82 C58 62 61 45 62 37" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
        <!-- Root tip hairs -->
        <path d="M50 94 C50 97 51 98 52 100" stroke-width="1" />
        <path d="M48 85 C45 86 42 87 40 88" stroke-width="0.8" />
        <path d="M52 87 C55 88 58 89 61 89" stroke-width="0.8" />
        <path d="M47 74 C43 75 40 75 37 77" stroke-width="0.8" />
        <!-- Horizontal carrot rings -->
        <path d="M40 44 C45 46 55 46 60 44" stroke-width="1.1" />
        <path d="M41 51 C46 53 54 53 59 51" stroke-width="1.1" />
        <path d="M43 59 C47 61 53 61 57 59" stroke-width="1.1" />
        <path d="M44 68 C47 70 53 70 56 68" stroke-width="1.1" />
        <path d="M46 76 C48 78 52 78 54 76" stroke-width="1.1" />
        <!-- Shading -->
        <path d="M42 46 C42 50 43 56 44 62" stroke-width="0.8" />
        <path d="M58 46 C58 50 57 56 56 62" stroke-width="0.8" />
      </g>
    `
  },
  {
    id: "sunflower",
    name: "Sunflower",
    commonName: "Sunflower",
    latinName: "Helianthus annuus",
    variety: "Mammoth Russian",
    notes: "Giant golden heads up to 14 inches across. Birds and pollinators adore.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stem and Leaf -->
        <path d="M50 78 C50 86 50 94 50 98" stroke-width="2.5" />
        <path d="M50 85 C42 84 32 87 25 93 C32 97 44 95 50 88" fill="currentColor" fill-opacity="0.15" stroke-width="1.2" />
        <!-- Petals ring (radiating) -->
        <g stroke-width="1.3" fill="currentColor" fill-opacity="0.08">
          <path d="M50 25 C47 16 48 8 50 5 C52 8 53 16 50 25 Z" />
          <path d="M62 29 C67 21 73 14 77 12 C77 16 75 24 67 33 Z" />
          <path d="M71 38 C79 34 87 32 91 32 C89 36 84 42 75 44 Z" />
          <path d="M75 50 C84 50 92 51 95 53 C92 56 84 58 75 56 Z" />
          <path d="M71 62 C79 66 87 68 91 68 C89 64 84 58 75 56 Z" />
          <path d="M62 71 C67 79 73 86 77 88 C77 84 75 76 67 67 Z" />
          <path d="M50 75 C47 84 48 92 50 95 C52 92 53 84 50 75 Z" />
          <path d="M38 71 C33 79 27 86 23 88 C23 84 25 76 33 67 Z" />
          <path d="M29 62 C21 66 13 68 9 68 C11 64 16 58 25 56 Z" />
          <path d="M25 50 C16 50 8 49 5 47 C8 44 16 42 25 44 Z" />
          <path d="M29 38 C21 34 13 32 9 32 C11 36 16 42 25 44 Z" />
          <path d="M38 29 C33 21 27 14 23 12 C23 16 25 24 33 33 Z" />
        </g>
        <!-- Center Seed Disc -->
        <circle cx="50" cy="50" r="18" stroke-width="2" fill="currentColor" fill-opacity="0.25" />
        <circle cx="50" cy="50" r="13" stroke-width="1.2" stroke-dasharray="2 1.5" />
        <circle cx="50" cy="50" r="8" stroke-width="1" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
        <!-- Disc spiral flecks -->
        <circle cx="45" cy="45" r="1" fill="currentColor" />
        <circle cx="55" cy="45" r="1" fill="currentColor" />
        <circle cx="45" cy="55" r="1" fill="currentColor" />
        <circle cx="55" cy="55" r="1" fill="currentColor" />
        <circle cx="50" cy="42" r="1" fill="currentColor" />
        <circle cx="50" cy="58" r="1" fill="currentColor" />
        <circle cx="42" cy="50" r="1" fill="currentColor" />
        <circle cx="58" cy="50" r="1" fill="currentColor" />
      </g>
    `
  },
  {
    id: "pepper",
    name: "Bell Pepper",
    commonName: "Sweet Bell Pepper",
    latinName: "Capsicum annuum",
    variety: "California Wonder",
    notes: "Thick walled, crisp, turns crimson red when fully mature.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stem -->
        <path d="M50 14 C48 20 49 26 50 30" stroke-width="3" />
        <path d="M47 14 C49 12 55 12 56 15" stroke-width="1.5" />
        <!-- Calyx -->
        <path d="M36 32 C41 28 47 29 50 31 C53 29 59 28 64 32 C61 36 57 37 50 36 C43 37 39 36 36 32 Z" fill="currentColor" fill-opacity="0.25" stroke-width="1.3" />
        <!-- Pepper Body -->
        <path d="M32 35 C23 42 22 66 26 80 C29 90 40 93 47 93 C49 93 51 93 53 93 C60 93 71 90 74 80 C78 66 77 42 68 35 C62 33 58 35 50 35 C42 35 38 33 32 35 Z" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
        <!-- Lobes -->
        <path d="M37 36 C35 48 37 72 45 92" stroke-width="1.2" />
        <path d="M63 36 C65 48 63 72 55 92" stroke-width="1.2" />
        <path d="M50 36 C50 50 50 75 50 93" stroke-width="1" stroke-dasharray="3 2" />
        <!-- Highlights & Hatching -->
        <path d="M29 50 C28 60 30 72 34 78" stroke-width="0.8" />
        <path d="M32 54 C31 62 33 70 36 75" stroke-width="0.8" />
        <path d="M71 50 C72 60 70 72 66 78" stroke-width="0.8" />
      </g>
    `
  },
  {
    id: "pea",
    name: "Garden Pea",
    commonName: "Garden Pea",
    latinName: "Pisum sativum",
    variety: "Little Marvel",
    notes: "Sweet plump peas in crisp pods. Thrives in cool spring soil.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stem and tendrils -->
        <path d="M22 18 C28 24 35 30 40 38" stroke-width="2" />
        <path d="M28 24 C26 16 30 10 38 8 C44 7 47 12 44 16 C41 20 34 18 36 24" stroke-width="1.2" />
        <path d="M22 18 C15 15 12 18 10 24 C9 28 13 32 17 30 C20 28 18 22 24 20" stroke-width="1.2" />
        <!-- Leaves -->
        <path d="M32 30 C30 20 40 18 46 25 C42 32 36 34 32 30 Z" fill="currentColor" fill-opacity="0.15" stroke-width="1.2" />
        <!-- Pea Pod Front -->
        <path d="M40 38 C48 39 65 46 76 60 C84 70 82 82 72 87 C56 86 42 70 36 55 C33 46 36 40 40 38 Z" stroke-width="2" fill="currentColor" fill-opacity="0.08"/>
        <!-- Pod split reveal -->
        <path d="M40 38 C49 46 64 56 72 87" stroke-width="1.3" />
        <!-- Round Peas nestled inside -->
        <circle cx="45" cy="48" r="5" fill="currentColor" fill-opacity="0.25" stroke-width="1.2" />
        <circle cx="54" cy="58" r="5.5" fill="currentColor" fill-opacity="0.25" stroke-width="1.2" />
        <circle cx="63" cy="69" r="5.5" fill="currentColor" fill-opacity="0.25" stroke-width="1.2" />
        <circle cx="70" cy="79" r="4.5" fill="currentColor" fill-opacity="0.25" stroke-width="1.2" />
        <!-- Highlight flecks on peas -->
        <path d="M43 46 A2 2 0 0 1 45 44" stroke-width="0.8" />
        <path d="M52 56 A2 2 0 0 1 54 54" stroke-width="0.8" />
        <path d="M61 67 A2 2 0 0 1 63 65" stroke-width="0.8" />
      </g>
    `
  },
  {
    id: "bean",
    name: "Pole Bean",
    commonName: "Green Bean",
    latinName: "Phaseolus vulgaris",
    variety: "Kentucky Wonder",
    notes: "Prolific heritage climbing bean with tender stringless pods.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Pole Vine -->
        <path d="M30 8 C35 25 45 50 40 75 C38 85 42 95 45 98" stroke-width="2.5" />
        <path d="M25 22 C35 20 48 24 55 18" stroke-width="1.2" />
        <!-- Trifoliate Leaf -->
        <path d="M55 18 C65 10 75 16 72 26 C62 28 58 22 55 18 Z" fill="currentColor" fill-opacity="0.15" stroke-width="1.2" />
        <path d="M55 18 C60 26 56 36 46 38 C45 30 50 22 55 18 Z" fill="currentColor" fill-opacity="0.15" stroke-width="1.2" />
        <!-- Hanging Bean Pod 1 -->
        <path d="M38 35 C42 45 50 62 52 75 C54 85 52 92 48 95 C46 95 46 91 47 84 C46 72 40 56 35 44 C33 40 35 36 38 35 Z" stroke-width="1.8" fill="currentColor" fill-opacity="0.1"/>
        <!-- Pod 1 bean bumps -->
        <path d="M40 52 C44 56 46 62 45 66" stroke-width="1" stroke-dasharray="2 1.5" />
        <path d="M45 68 C49 72 51 78 50 82" stroke-width="1" stroke-dasharray="2 1.5" />
        <!-- Hanging Bean Pod 2 -->
        <path d="M42 46 C48 55 60 70 65 82 C68 90 66 94 62 96 C60 95 61 90 60 84 C56 73 47 60 40 52 Z" stroke-width="1.6" fill="currentColor" fill-opacity="0.08"/>
      </g>
    `
  },
  {
    id: "basil",
    name: "Sweet Basil",
    commonName: "Sweet Basil",
    latinName: "Ocimum basilicum",
    variety: "Genovese",
    notes: "Intensely aromatic leaves. Pinch blossoms to prolong foliage harvest.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Main Stem -->
        <path d="M50 20 C50 45 50 75 50 96" stroke-width="2.5" />
        <!-- Flower top -->
        <circle cx="50" cy="16" r="2.5" fill="currentColor" />
        <circle cx="47" cy="20" r="2" fill="currentColor" />
        <circle cx="53" cy="20" r="2" fill="currentColor" />
        <!-- Top Leaf Pair -->
        <path d="M50 30 C40 22 30 25 28 34 C30 42 42 40 50 34" fill="currentColor" fill-opacity="0.15" stroke-width="1.3" />
        <path d="M50 30 C60 22 70 25 72 34 C70 42 58 40 50 34" fill="currentColor" fill-opacity="0.15" stroke-width="1.3" />
        <!-- Middle Leaf Pair (Large Cupped) -->
        <path d="M50 50 C36 40 18 42 16 56 C16 70 36 68 50 56" fill="currentColor" fill-opacity="0.18" stroke-width="1.6" />
        <path d="M50 50 C64 40 82 42 84 56 C84 70 64 68 50 56" fill="currentColor" fill-opacity="0.18" stroke-width="1.6" />
        <!-- Leaf Veins -->
        <path d="M22 53 C30 52 40 53 48 52" stroke-width="0.9" />
        <path d="M78 53 C70 52 60 53 52 52" stroke-width="0.9" />
        <!-- Lower Leaf Pair -->
        <path d="M50 72 C34 65 20 72 22 84 C26 94 44 88 50 78" fill="currentColor" fill-opacity="0.12" stroke-width="1.4" />
        <path d="M50 72 C66 65 80 72 78 84 C74 94 56 88 50 78" fill="currentColor" fill-opacity="0.12" stroke-width="1.4" />
      </g>
    `
  },
  {
    id: "lavender",
    name: "Lavender",
    commonName: "English Lavender",
    latinName: "Lavandula angustifolia",
    variety: "Munstead Blue",
    notes: "Fragrant violet spikes for drying, sachets, and pollinator gardens.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stems -->
        <path d="M50 40 L50 96" stroke-width="2" />
        <path d="M50 65 C43 55 38 48 35 38 L32 94" stroke-width="1.4" />
        <path d="M50 62 C57 55 62 48 65 38 L68 94" stroke-width="1.4" />
        <!-- Center Flower Spike -->
        <g stroke-width="1.2" fill="currentColor" fill-opacity="0.25">
          <ellipse cx="50" cy="12" rx="3.5" ry="2.5" />
          <ellipse cx="46" cy="17" rx="3.5" ry="2.5" />
          <ellipse cx="54" cy="17" rx="3.5" ry="2.5" />
          <ellipse cx="45" cy="23" rx="4" ry="2.8" />
          <ellipse cx="55" cy="23" rx="4" ry="2.8" />
          <ellipse cx="45" cy="29" rx="4" ry="2.8" />
          <ellipse cx="55" cy="29" rx="4" ry="2.8" />
          <ellipse cx="46" cy="35" rx="3.5" ry="2.5" />
          <ellipse cx="54" cy="35" rx="3.5" ry="2.5" />
          <ellipse cx="47" cy="41" rx="3" ry="2" />
          <ellipse cx="53" cy="41" rx="3" ry="2" />
        </g>
        <!-- Left Spike -->
        <g stroke-width="1.1" fill="currentColor" fill-opacity="0.2">
          <ellipse cx="33" cy="22" rx="3" ry="2" />
          <ellipse cx="29" cy="27" rx="3.5" ry="2.2" />
          <ellipse cx="37" cy="27" rx="3.5" ry="2.2" />
          <ellipse cx="30" cy="33" rx="3.5" ry="2.2" />
          <ellipse cx="37" cy="33" rx="3.5" ry="2.2" />
        </g>
        <!-- Right Spike -->
        <g stroke-width="1.1" fill="currentColor" fill-opacity="0.2">
          <ellipse cx="67" cy="22" rx="3" ry="2" />
          <ellipse cx="63" cy="27" rx="3.5" ry="2.2" />
          <ellipse cx="71" cy="27" rx="3.5" ry="2.2" />
          <ellipse cx="63" cy="33" rx="3.5" ry="2.2" />
          <ellipse cx="71" cy="33" rx="3.5" ry="2.2" />
        </g>
        <!-- Narrow linear leaves -->
        <path d="M48 75 C40 73 30 76 25 82" stroke-width="1.3" />
        <path d="M52 75 C60 73 70 76 75 82" stroke-width="1.3" />
        <path d="M49 83 C42 82 34 85 30 90" stroke-width="1.3" />
        <path d="M51 83 C58 82 66 85 70 90" stroke-width="1.3" />
      </g>
    `
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    commonName: "Field Pumpkin",
    latinName: "Cucurbita pepo",
    variety: "Connecticut Field",
    notes: "Traditional New England carving and baking pumpkin. Long vigorous vines.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stem & Tendril -->
        <path d="M50 35 C48 24 53 16 57 12 C59 18 55 26 53 35" stroke-width="2.2" fill="currentColor" fill-opacity="0.2" />
        <path d="M57 18 C64 16 70 20 71 25 C72 30 67 34 62 31 C59 29 60 23 66 22" stroke-width="1.2" />
        <!-- Pumpkin Ribs / Lobes (symmetric woodcut layout) -->
        <!-- Outer left lobe -->
        <path d="M48 35 C34 35 15 45 15 62 C15 78 30 87 45 87" stroke-width="1.8" fill="currentColor" fill-opacity="0.06" />
        <!-- Outer right lobe -->
        <path d="M52 35 C66 35 85 45 85 62 C85 78 70 87 55 87" stroke-width="1.8" fill="currentColor" fill-opacity="0.06" />
        <!-- Mid-left lobe -->
        <path d="M49 35 C38 35 28 44 28 62 C28 77 38 87 48 88" stroke-width="1.6" fill="currentColor" fill-opacity="0.06" />
        <!-- Mid-right lobe -->
        <path d="M51 35 C62 35 72 44 72 62 C72 77 62 87 52 88" stroke-width="1.6" fill="currentColor" fill-opacity="0.06" />
        <!-- Center lobe -->
        <path d="M50 35 C43 35 40 45 40 62 C40 78 44 88 50 88 C56 88 60 78 60 62 C60 45 57 35 50 35 Z" stroke-width="2" fill="currentColor" fill-opacity="0.1" />
        <!-- Base indents and hatchings -->
        <path d="M22 66 C25 74 31 80 39 83" stroke-width="0.8" />
        <path d="M78 66 C75 74 69 80 61 83" stroke-width="0.8" />
      </g>
    `
  },
  {
    id: "bee",
    name: "Honeybee & Flower",
    commonName: "Wildflower Mix",
    latinName: "Mellifera & Flora",
    variety: "Bee & Pollinator Meadow",
    notes: "Nectar-rich bloom blend supporting native bumblebees and honeybees.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Wildflower below -->
        <circle cx="50" cy="74" r="7" fill="currentColor" fill-opacity="0.3" stroke-width="1.5" />
        <path d="M50 67 C48 58 52 58 50 67 M57 74 C66 72 66 76 57 74 M50 81 C48 90 52 90 50 81 M43 74 C34 72 34 76 43 74" stroke-width="1.4" />
        <path d="M50 81 L50 96" stroke-width="2" />
        <!-- Flying Honeybee above -->
        <!-- Abdomen with stripes -->
        <ellipse cx="50" cy="38" rx="8" ry="12" stroke-width="1.8" fill="currentColor" fill-opacity="0.1" transform="rotate(-15 50 38)" />
        <path d="M43 34 C46 37 54 36 57 32" stroke-width="1.5" />
        <path d="M45 40 C48 43 55 42 58 38" stroke-width="1.5" />
        <path d="M47 45 C49 47 54 46 56 43" stroke-width="1.3" />
        <!-- Thorax and Head -->
        <ellipse cx="44" cy="26" rx="6" ry="6" stroke-width="1.6" fill="currentColor" fill-opacity="0.4" />
        <circle cx="39" cy="22" r="3" stroke-width="1.3" fill="currentColor" />
        <path d="M38 20 C36 15 33 13 30 12 M39 19 C39 14 41 12 43 10" stroke-width="1" />
        <!-- Wings -->
        <path d="M46 25 C50 15 62 10 70 12 C72 18 64 25 50 26 Z" stroke-width="1.4" fill="currentColor" fill-opacity="0.15" />
        <path d="M48 27 C54 22 64 22 68 28 C66 33 58 34 50 29 Z" stroke-width="1.1" fill="currentColor" fill-opacity="0.12" />
        <!-- Legs -->
        <path d="M44 32 C41 36 38 42 35 44 M47 33 C45 39 44 46 42 50" stroke-width="1.1" />
      </g>
    `
  },
  {
    id: "strawberry",
    name: "Wild Strawberry",
    commonName: "Alpine Strawberry",
    latinName: "Fragaria vesca",
    variety: "Alexandria",
    notes: "Intensely perfumed everbearing wild strawberry without runners.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stem -->
        <path d="M50 16 C50 25 50 32 50 36" stroke-width="2" />
        <!-- Calyx Leaflets -->
        <path d="M50 36 C42 32 35 34 30 38 C36 40 44 38 50 38" fill="currentColor" fill-opacity="0.2" stroke-width="1.3" />
        <path d="M50 36 C58 32 65 34 70 38 C64 40 56 38 50 38" fill="currentColor" fill-opacity="0.2" stroke-width="1.3" />
        <path d="M50 36 C48 42 42 46 38 48 C43 45 47 42 50 38" fill="currentColor" fill-opacity="0.2" stroke-width="1.3" />
        <path d="M50 36 C52 42 58 46 62 48 C57 45 53 42 50 38" fill="currentColor" fill-opacity="0.2" stroke-width="1.3" />
        <!-- Strawberry Heart Body -->
        <path d="M30 38 C24 48 26 66 38 78 C44 84 48 88 50 90 C52 88 56 84 62 78 C74 66 76 48 70 38 C62 36 38 36 30 38 Z" stroke-width="2" fill="currentColor" fill-opacity="0.08"/>
        <!-- Seed achenes pattern -->
        <g stroke-width="0.9">
          <circle cx="42" cy="45" r="1" fill="currentColor" />
          <circle cx="50" cy="45" r="1" fill="currentColor" />
          <circle cx="58" cy="45" r="1" fill="currentColor" />
          <circle cx="36" cy="53" r="1" fill="currentColor" />
          <circle cx="45" cy="53" r="1" fill="currentColor" />
          <circle cx="55" cy="53" r="1" fill="currentColor" />
          <circle cx="64" cy="53" r="1" fill="currentColor" />
          <circle cx="40" cy="62" r="1" fill="currentColor" />
          <circle cx="50" cy="62" r="1" fill="currentColor" />
          <circle cx="60" cy="62" r="1" fill="currentColor" />
          <circle cx="45" cy="71" r="1" fill="currentColor" />
          <circle cx="55" cy="71" r="1" fill="currentColor" />
          <circle cx="50" cy="80" r="1" fill="currentColor" />
        </g>
      </g>
    `
  },
  {
    id: "radish",
    name: "French Radish",
    commonName: "Radish",
    latinName: "Raphanus sativus",
    variety: "French Breakfast",
    notes: "Crisp oblong bicolour radish with bright scarlet top and white tip.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Leafy Greens -->
        <path d="M48 38 C45 28 38 18 30 10 M38 22 C32 18 25 20 20 16 M42 30 C34 26 27 28 22 26" stroke-width="1.3" />
        <path d="M50 38 C50 24 53 14 56 6 M52 20 C58 16 64 18 70 14 M51 28 C58 25 65 27 72 25" stroke-width="1.3" />
        <!-- Crown and Body -->
        <path d="M43 38 C45 36 55 36 57 38 C60 48 62 65 59 78 C57 85 53 90 50 92 C47 90 43 85 41 78 C38 65 40 48 43 38 Z" stroke-width="2" fill="currentColor" fill-opacity="0.08"/>
        <!-- Scarlet / White demarcation line -->
        <path d="M41 70 C46 72 54 72 59 70" stroke-width="1.2" stroke-dasharray="2 1.5" />
        <!-- Long taproot tail -->
        <path d="M50 92 C50 95 49 97 51 100" stroke-width="1.2" />
        <!-- Fine root hairs -->
        <path d="M48 84 C44 85 40 85 36 84" stroke-width="0.8" />
        <path d="M52 86 C56 87 60 87 64 86" stroke-width="0.8" />
      </g>
    `
  },
  {
    id: "poppy",
    name: "Heritage Poppy",
    commonName: "Breadseed Poppy",
    latinName: "Papaver somniferum",
    variety: "Lauren's Grape",
    notes: "Silky petals followed by ornamental seed capsules packed with seeds.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stem -->
        <path d="M50 48 L50 96" stroke-width="2.2" />
        <path d="M50 72 C42 70 32 74 26 80 M50 64 C58 62 68 66 74 72" stroke-width="1.2" />
        <!-- Poppy Seed Capsule (Goblet urn) -->
        <path d="M38 34 C36 44 42 54 50 54 C58 54 64 44 62 34 Z" stroke-width="2" fill="currentColor" fill-opacity="0.15" />
        <!-- Capsule Crown / Stigmatic disc -->
        <path d="M34 32 C34 29 66 29 66 32 C66 35 34 35 34 32 Z" stroke-width="1.6" fill="currentColor" fill-opacity="0.3" />
        <!-- Serrated crown points -->
        <path d="M36 29 L38 25 L41 29 L44 25 L47 29 L50 24 L53 29 L56 25 L59 29 L62 25 L64 29" stroke-width="1.2" />
        <!-- Rib lines on urn -->
        <path d="M44 34 C44 40 46 48 50 53" stroke-width="1" />
        <path d="M56 34 C56 40 54 48 50 53" stroke-width="1" />
        <path d="M50 34 L50 54" stroke-width="0.8" stroke-dasharray="2 1.5" />
      </g>
    `
  },
  {
    id: "marigold",
    name: "French Marigold",
    commonName: "French Marigold",
    latinName: "Tagetes patula",
    variety: "Sparky Mixed",
    notes: "Cheerful ruffled blooms. Companion plant deterring garden pests.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stem -->
        <path d="M50 65 L50 96" stroke-width="2.2" />
        <!-- Calyx Cup -->
        <path d="M42 54 C42 64 58 64 58 54 Z" stroke-width="1.6" fill="currentColor" fill-opacity="0.25" />
        <path d="M42 54 L44 48 M50 54 L50 47 M58 54 L56 48" stroke-width="1.2" />
        <!-- Ruffled Petals Dome -->
        <path d="M25 45 C20 40 24 32 30 30 C28 22 36 18 42 20 C46 14 54 14 58 20 C64 18 72 22 70 30 C76 32 80 40 75 45 C78 52 70 56 64 54 C60 58 54 58 50 55 C46 58 40 58 36 54 C30 56 22 52 25 45 Z" stroke-width="2" fill="currentColor" fill-opacity="0.1" />
        <!-- Inner Ruffle Layers -->
        <path d="M33 38 C35 32 42 30 46 32 C50 28 56 30 58 35 C64 35 66 42 62 45" stroke-width="1.2" />
        <path d="M38 44 C42 40 48 40 50 43 C54 39 60 41 58 46" stroke-width="1.2" />
        <!-- Serrated leaf spray -->
        <path d="M50 78 C38 74 30 78 24 86 M36 76 L34 72 M42 77 L42 73" stroke-width="1.2" />
        <path d="M50 82 C62 78 70 82 76 90 M64 80 L66 76 M58 81 L58 77" stroke-width="1.2" />
      </g>
    `
  },
  {
    id: "beet",
    name: "Heritage Beet",
    commonName: "Beetroot",
    latinName: "Beta vulgaris",
    variety: "Detroit Dark Red",
    notes: "Deep blood-red globes with sweet earthy flesh and nutritious greens.",
    svg: `
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Foliage stalks -->
        <path d="M46 38 C42 26 36 16 28 8 M38 20 C30 16 24 18 18 14" stroke-width="1.5" />
        <path d="M50 38 C50 22 52 12 55 5 M51 18 C58 14 64 16 70 12" stroke-width="1.5" />
        <path d="M54 38 C58 26 64 16 72 8 M62 20 C70 16 76 18 82 14" stroke-width="1.5" />
        <!-- Beet Globe Body -->
        <circle cx="50" cy="58" r="22" stroke-width="2" fill="currentColor" fill-opacity="0.1" />
        <!-- Concentric growth rings -->
        <path d="M33 52 C38 48 62 48 67 52" stroke-width="1" />
        <path d="M31 60 C38 56 62 56 69 60" stroke-width="1" />
        <path d="M34 68 C40 65 60 65 66 68" stroke-width="1" />
        <!-- Taproot -->
        <path d="M50 80 C50 86 48 92 51 98" stroke-width="1.8" />
        <path d="M49 88 C44 89 40 89 36 89" stroke-width="0.8" />
        <path d="M51 91 C55 92 59 92 63 92" stroke-width="0.8" />
      </g>
    `
  }
];

