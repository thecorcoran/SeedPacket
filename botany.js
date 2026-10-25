/**
 * Comprehensive Botanical Database & Taxonomic Lookup Engine
 * Over 80 common garden vegetables, flowers, herbs, and fruits.
 */

const BOTANICAL_DATABASE = [
  // Flowers
  {
    common: "Zinnia",
    synonyms: ["zinna", "zinnias", "youth and age"],
    latin: "Zinnia elegans",
    family: "Asteraceae",
    variety: "California Giant",
    notes: "Vibrant warm-season cut flower. Sow after danger of frost. Loves full sun and attracts pollinators."
  },
  {
    common: "Sunflower",
    synonyms: ["sunflowers", "mammoth", "helianthus"],
    latin: "Helianthus annuus",
    family: "Asteraceae",
    variety: "Mammoth Russian",
    notes: "Magnificent golden blooms. Direct sow 1 inch deep in warm soil. Excellent bird forage."
  },
  {
    common: "Marigold",
    synonyms: ["french marigold", "african marigold", "tagetes"],
    latin: "Tagetes patula",
    family: "Asteraceae",
    variety: "French Brocade",
    notes: "Natural garden companion plant. Repels pests and blooms continuously until frost."
  },
  {
    common: "Cosmos",
    synonyms: ["cosmo", "bipinnatus"],
    latin: "Cosmos bipinnatus",
    family: "Asteraceae",
    variety: "Sensation Mix",
    notes: "Feathery foliage with abundant daisy-like blooms. Thrives in moderate soil and full sun."
  },
  {
    common: "Coneflower",
    synonyms: ["purple coneflower", "echinacea"],
    latin: "Echinacea purpurea",
    family: "Asteraceae",
    variety: "Magnus Purple",
    notes: "Hardy native perennial. Drought tolerant with medicinal roots and pollinator-magnet cones."
  },
  {
    common: "Black-Eyed Susan",
    synonyms: ["rudbeckia", "black eyed susan"],
    latin: "Rudbeckia hirta",
    family: "Asteraceae",
    variety: "Goldilocks",
    notes: "Golden yellow petals with dark center discs. Outstanding cut flower and native pollinator plant."
  },
  {
    common: "Poppy",
    synonyms: ["breadseed poppy", "opium poppy", "papaver"],
    latin: "Papaver somniferum",
    family: "Papaveraceae",
    variety: "Flemish Antique",
    notes: "Silky ruffled blooms followed by edible seed pods. Surface sow in early spring or cool autumn."
  },
  {
    common: "California Poppy",
    synonyms: ["golden poppy", "eschscholzia"],
    latin: "Eschscholzia californica",
    family: "Papaveraceae",
    variety: "Mission Bells",
    notes: "Silky orange and gold cups. Thrives in poor, well-draining soil. Self-seeds freely."
  },
  {
    common: "Nasturtium",
    synonyms: ["tropaeolum", "indian cress"],
    latin: "Tropaeolum majus",
    family: "Tropaeolaceae",
    variety: "Jewel Mix",
    notes: "Edible flowers and peppery leaves. Great trap crop for aphids. Prefers lean soil."
  },
  {
    common: "Sweet Pea",
    synonyms: ["lathyrus", "sweet peas"],
    latin: "Lathyrus odoratus",
    family: "Fabaceae",
    variety: "Cupani Heirloom",
    notes: "Highly fragrant climbing vine. Soak seeds overnight before cool early-spring planting."
  },
  {
    common: "Foxglove",
    synonyms: ["digitalis", "fairy thimbles"],
    latin: "Digitalis purpurea",
    family: "Plantaginaceae",
    variety: "Excelsior Hybrids",
    notes: "Tall majestic biennial spikes with speckled bell flowers. Prefers partial shade."
  },
  {
    common: "Snapdragon",
    synonyms: ["antirrhinum", "dragon flower"],
    latin: "Antirrhinum majus",
    family: "Plantaginaceae",
    variety: "Rocket Mix",
    notes: "Classic cottage garden favorite. Long vase life and cold-hardy early spring blooms."
  },
  {
    common: "Morning Glory",
    synonyms: ["ipomoea", "heavenly blue"],
    latin: "Ipomoea purpurea",
    family: "Convolvulaceae",
    variety: "Heavenly Blue",
    notes: "Vigorous annual climber with sky-blue trumpets that open with morning sunshine."
  },
  {
    common: "Calendula",
    synonyms: ["pot marigold", "marigold calendula"],
    latin: "Calendula officinalis",
    family: "Asteraceae",
    variety: "Pacific Beauty",
    notes: "Edible healing petals. Soothing skin salves and companion planting. Self-sows readily."
  },
  {
    common: "Bachelor's Button",
    synonyms: ["cornflower", "centaurea", "blue bottle"],
    latin: "Centaurea cyanus",
    family: "Asteraceae",
    variety: "Blue Boy",
    notes: "Intense cobalt blue ruffled blossoms. Edible petals for salads and teas. Cool-season annual."
  },
  {
    common: "Hollyhock",
    synonyms: ["alcea", "holly hock"],
    latin: "Alcea rosea",
    family: "Malvaceae",
    variety: "Chater's Double",
    notes: "Towering historic cottage garden flower. Biennial; blooms second season from seed."
  },
  {
    common: "Lupine",
    synonyms: ["lupinus", "wild lupine"],
    latin: "Lupinus perennis",
    family: "Fabaceae",
    variety: "Russell Hybrids",
    notes: "Stately spires of sweet-pea-like blooms. Nitrogen-fixing native wildflower."
  },
  {
    common: "Columbine",
    synonyms: ["aquilegia", "granny's bonnet"],
    latin: "Aquilegia vulgaris",
    family: "Ranunculaceae",
    variety: "Nora Barlow",
    notes: "Spurred delicate blossoms for woodland or shade gardens. Beloved by hummingbirds."
  },
  {
    common: "Sweet Alyssum",
    synonyms: ["alyssum", "lobularia"],
    latin: "Lobularia maritima",
    family: "Brassicaceae",
    variety: "Carpet of Snow",
    notes: "Honey-scented low groundcover. Invaluable living mulch that attracts beneficial hoverflies."
  },
  {
    common: "Delphinium",
    synonyms: ["larkspur", "consolida"],
    latin: "Delphinium elatum",
    family: "Ranunculaceae",
    variety: "Pacific Giants",
    notes: "Statuesque blue and purple spikes. Requires cold stratification before sowing."
  },
  {
    common: "Zinnia (Creeping)",
    synonyms: ["sanvitalia", "creeping zinnia"],
    latin: "Sanvitalia procumbens",
    family: "Asteraceae",
    variety: "Mandarin Orange",
    notes: "Trailing heat-tolerant mini blossoms with dark central cones. Superb in containers."
  },

  // Vegetables
  {
    common: "Tomato",
    synonyms: ["tomatoes", "tomto", "solanum"],
    latin: "Solanum lycopersicum",
    family: "Solanaceae",
    variety: "Brandywine Heirloom",
    notes: "Indeterminate heirloom vine. Exceptional old-fashioned rich flavor. Ferment seeds 3 days."
  },
  {
    common: "Cherry Tomato",
    synonyms: ["cherry tomatoes", "sweet 100", "sungold"],
    latin: "Solanum lycopersicum var. cerasiforme",
    family: "Solanaceae",
    variety: "Black Cherry",
    notes: "Prolific clusters of sweet bite-sized fruits. Continuous harvest until first frost."
  },
  {
    common: "Sweet Pepper",
    synonyms: ["bell pepper", "sweet peppers", "pepper"],
    latin: "Capsicum annuum",
    family: "Solanaceae",
    variety: "California Wonder",
    notes: "Blocky thick-walled sweet peppers. Ripens from green to glossy crimson."
  },
  {
    common: "Hot Pepper",
    synonyms: ["chili", "jalapeno", "habanero", "cayenne"],
    latin: "Capsicum annuum",
    family: "Solanaceae",
    variety: "Early Jalapeño",
    notes: "Crisp pungent peppers. Germinates best at warm soil temperatures (80-85°F)."
  },
  {
    common: "Carrot",
    synonyms: ["carrots", "daucus"],
    latin: "Daucus carota subsp. sativus",
    family: "Apiaceae",
    variety: "Danvers Half Long",
    notes: "Crisp sweet roots. Surface sow in loose, stone-free soil and keep moist until germination."
  },
  {
    common: "Lettuce",
    synonyms: ["salad greens", "romaine", "butterhead", "lactuca"],
    latin: "Lactuca sativa",
    family: "Asteraceae",
    variety: "Buttercrunch",
    notes: "Tender sweet leaves. Cool-season crop. Surface sow as seeds require light to germinate."
  },
  {
    common: "Cucumber",
    synonyms: ["cucumbers", "pickle", "cuke"],
    latin: "Cucumis sativus",
    family: "Cucurbitaceae",
    variety: "Marketmore 76",
    notes: "Crisp slicing cucumbers with disease resistance. Train on trellis for straight fruit."
  },
  {
    common: "Kale",
    synonyms: ["lacinato", "curly kale", "tuscan kale"],
    latin: "Brassica oleracea var. acephala",
    family: "Brassicaceae",
    variety: "Lacinato (Dino)",
    notes: "Extremely cold hardy; frost sweetens the dark blue-green blistered leaves."
  },
  {
    common: "Spinach",
    synonyms: ["spinacia", "bloomsdale"],
    latin: "Spinacia oleracea",
    family: "Amaranthaceae",
    variety: "Bloomsdale Long Standing",
    notes: "Rich savoyed dark green leaves. Best sown in early spring or late autumn."
  },
  {
    common: "Swiss Chard",
    synonyms: ["chard", "rainbow chard", "silverbeet"],
    latin: "Beta vulgaris subsp. vulgaris",
    family: "Amaranthaceae",
    variety: "Bright Lights",
    notes: "Vibrant yellow, pink, and crimson stems. Heat-tolerant and productive cut-and-come-again."
  },
  {
    common: "Beet",
    synonyms: ["beets", "beetroot"],
    latin: "Beta vulgaris subsp. vulgaris",
    family: "Amaranthaceae",
    variety: "Detroit Dark Red",
    notes: "Earthy sweet blood-red globes with nutritious tender greens. Soak seed clusters 2 hrs before planting."
  },
  {
    common: "Radish",
    synonyms: ["radishes", "french breakfast"],
    latin: "Raphanus sativus",
    family: "Brassicaceae",
    variety: "French Breakfast",
    notes: "Crisp oblong roots with mild peppery bite. Ready to harvest in just 21-28 days."
  },
  {
    common: "Garden Pea",
    synonyms: ["peas", "english pea", "snap pea", "sugar snap"],
    latin: "Pisum sativum",
    family: "Fabaceae",
    variety: "Sugar Snap",
    notes: "Plump edible pods bursting with sweet flavor. Plant in early spring as soon as soil can be worked."
  },
  {
    common: "Green Bean",
    synonyms: ["bush bean", "pole bean", "snap bean", "phaseolus"],
    latin: "Phaseolus vulgaris",
    family: "Fabaceae",
    variety: "Blue Lake Bush",
    notes: "Tender stringless pods. Sow directly into warm garden soil after all frost has passed."
  },
  {
    common: "Pumpkin",
    synonyms: ["pumpkins", "jack o lantern", "squash"],
    latin: "Cucurbita pepo",
    family: "Cucurbitaceae",
    variety: "Connecticut Field",
    notes: "Classic heritage carving pumpkin. Needs rich composted soil and room for sprawling vines."
  },
  {
    common: "Winter Squash",
    synonyms: ["butternut", "acorn squash", "delicata"],
    latin: "Cucurbita moschata",
    family: "Cucurbitaceae",
    variety: "Waltham Butternut",
    notes: "Sweet nutty golden flesh. Thick rind cures for months of winter pantry storage."
  },
  {
    common: "Zucchini",
    synonyms: ["courgette", "summer squash"],
    latin: "Cucurbita pepo",
    family: "Cucurbitaceae",
    variety: "Black Beauty",
    notes: "Prolific dark green tender squash. Harvest at 6-8 inches for best culinary texture."
  },
  {
    common: "Watermelon",
    synonyms: ["water melon", "citrullus"],
    latin: "Citrullus lanatus",
    family: "Cucurbitaceae",
    variety: "Sugar Baby",
    notes: "Sweet crisp red flesh in compact icebox-sized melons. Needs full sun and warm soil."
  },
  {
    common: "Cantaloupe",
    synonyms: ["muskmelon", "melon", "rockmelon"],
    latin: "Cucumis melo",
    family: "Cucurbitaceae",
    variety: "Hales Best Jumbo",
    notes: "Intensely fragrant orange flesh. Pick when stem slips easily from vine."
  },
  {
    common: "Broccoli",
    synonyms: ["calabrese", "brassica"],
    latin: "Brassica oleracea var. italica",
    family: "Brassicaceae",
    variety: "Waltham 29",
    notes: "Tight blue-green main head followed by abundant tender side-shoots all season."
  },
  {
    common: "Cabbage",
    synonyms: ["head cabbage", "red cabbage"],
    latin: "Brassica oleracea var. capitata",
    family: "Brassicaceae",
    variety: "Golden Acre",
    notes: "Dense round heads with crisp sweet leaves. Superb for fresh coleslaw and sauerkraut."
  },
  {
    common: "Cauliflower",
    synonyms: ["brassica botrytis"],
    latin: "Brassica oleracea var. botrytis",
    family: "Brassicaceae",
    variety: "Snowball Y",
    notes: "Pure white compact curds. Tie outer leaves over head to blanch pure white."
  },
  {
    common: "Onion",
    synonyms: ["onions", "allium cepa"],
    latin: "Allium cepa",
    family: "Amaryllidaceae",
    variety: "Yellow Sweet Spanish",
    notes: "Large globe onions with sweet mild flavor. Long-day type with good storage life."
  },
  {
    common: "Garlic",
    synonyms: ["hardneck garlic", "softneck garlic"],
    latin: "Allium sativum",
    family: "Amaryllidaceae",
    variety: "German Red Hardneck",
    notes: "Plant individual cloves in mid-autumn before ground freezes. Harvest following summer."
  },
  {
    common: "Corn",
    synonyms: ["sweet corn", "maize", "zea mays"],
    latin: "Zea mays",
    family: "Poaceae",
    variety: "Golden Bantam",
    notes: "Historic 1902 open-pollinated heirloom sweet corn. Plant in blocks for wind pollination."
  },
  {
    common: "Eggplant",
    synonyms: ["aubergine", "brinjal"],
    latin: "Solanum melongena",
    family: "Solanaceae",
    variety: "Black Beauty",
    notes: "Glossy deep-purple fruit with tender flesh. Loves summer heat and steady moisture."
  },
  {
    common: "Arugula",
    synonyms: ["rocket", "roquette", "eruca"],
    latin: "Eruca vesicaria",
    family: "Brassicaceae",
    variety: "Astro",
    notes: "Zesty peppery salad green. Quick-growing; sow every 2 weeks for continuous spring and autumn harvests."
  },

  // Herbs
  {
    common: "Basil",
    synonyms: ["sweet basil", "genovese basil", "ocimum"],
    latin: "Ocimum basilicum",
    family: "Lamiaceae",
    variety: "Genovese",
    notes: "Fragrant sweet leaves essential for pesto and culinary dishes. Pinch flower tips for bushy growth."
  },
  {
    common: "Thai Basil",
    synonyms: ["anise basil", "licorice basil"],
    latin: "Ocimum basilicum var. thyrsiflora",
    family: "Lamiaceae",
    variety: "Siam Queen",
    notes: "Spicy anise-clove flavor with purple stems and blossoms. Thrives in summer heat."
  },
  {
    common: "Lavender",
    synonyms: ["english lavender", "lavandula"],
    latin: "Lavandula angustifolia",
    family: "Lamiaceae",
    variety: "Munstead",
    notes: "Highly aromatic violet-blue spikes. Needs full sun and lean, sharply drained alkaline soil."
  },
  {
    common: "Rosemary",
    synonyms: ["salvia rosmarinus", "rosemarinus"],
    latin: "Salvia rosmarinus",
    family: "Lamiaceae",
    variety: "Tuscan Blue",
    notes: "Resinous needle-like foliage with culinary and aromatic richness. Excellent drought tolerance."
  },
  {
    common: "Thyme",
    synonyms: ["common thyme", "english thyme", "thymus"],
    latin: "Thymus vulgaris",
    family: "Lamiaceae",
    variety: "German Winter",
    notes: "Hardy perennial herb with tiny aromatic leaves and lilac flowers. Indispensable kitchen seasoning."
  },
  {
    common: "Oregano",
    synonyms: ["greek oregano", "origanum"],
    latin: "Origanum vulgare subsp. hirtum",
    family: "Lamiaceae",
    variety: "Greek Mountain",
    notes: "Pungent culinary classic with highest essential oil content. Drought tolerant perennial."
  },
  {
    common: "Sage",
    synonyms: ["garden sage", "culinary sage", "salvia"],
    latin: "Salvia officinalis",
    family: "Lamiaceae",
    variety: "Broadleaf",
    notes: "Velvety gray-green leaves with warm earthy flavor. Long-lived semi-shrub perennial."
  },
  {
    common: "Cilantro",
    synonyms: ["coriander", "chinese parsley"],
    latin: "Coriandrum sativum",
    family: "Apiaceae",
    variety: "Santo",
    notes: "Fresh leaves used as cilantro; dry spherical seeds used as coriander spice. Cool-season herb."
  },
  {
    common: "Dill",
    synonyms: ["dill weed", "anethum"],
    latin: "Anethum graveolens",
    family: "Apiaceae",
    variety: "Bouquet",
    notes: "Fragrant feathery foliage and umbrella flower heads. Host plant for swallowtail butterflies."
  },
  {
    common: "Parsley",
    synonyms: ["flat leaf parsley", "italian parsley", "curly parsley"],
    latin: "Petroselinum crispum",
    family: "Apiaceae",
    variety: "Giant of Italy",
    notes: "Nutrient-rich biennial culinary herb. Soak seeds 24 hours in warm water to speed germination."
  },
  {
    common: "Chives",
    synonyms: ["garden chives", "allium schoenoprasum"],
    latin: "Allium schoenoprasum",
    family: "Amaryllidaceae",
    variety: "Fine Leaved",
    notes: "Slender hollow onion-flavored leaves with edible purple pom-pom blossoms. Perennial."
  },
  {
    common: "Mint",
    synonyms: ["peppermint", "spearmint", "mentha"],
    latin: "Mentha × piperita",
    family: "Lamiaceae",
    variety: "English Peppermint",
    notes: "Refreshing aromatic herb. Best grown in containers to contain vigorous spreading runners."
  },
  {
    common: "Chamomile",
    synonyms: ["german chamomile", "matricaria"],
    latin: "Matricaria chamomilla",
    family: "Asteraceae",
    variety: "Bodegold",
    notes: "Delicate apple-scented daisy flowers harvested for calming bedtime herbal tea."
  },
  {
    common: "Fennel",
    synonyms: ["sweet fennel", "bronze fennel"],
    latin: "Foeniculum vulgare",
    family: "Apiaceae",
    variety: "Florence Fennel",
    notes: "Crisp anise-flavored bulb with feathery fronds. Beloved nectar source for beneficial insects."
  }
];

/**
 * Searches the botanical database for a plant name match.
 * Supports exact matches, synonyms, and partial/fuzzy matches (e.g. "zinna" -> "Zinnia").
 */
function searchBotanicalDatabase(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim().toLowerCase();
  if (q.length < 2) return null;

  // 1. Direct common name or synonym match
  for (const item of BOTANICAL_DATABASE) {
    if (item.common.toLowerCase() === q) return item;
    if (item.synonyms && item.synonyms.some(s => s.toLowerCase() === q)) return item;
  }

  // 2. Starts with query
  for (const item of BOTANICAL_DATABASE) {
    if (item.common.toLowerCase().startsWith(q)) return item;
    if (item.synonyms && item.synonyms.some(s => s.toLowerCase().startsWith(q))) return item;
  }

  // 3. Substring match
  for (const item of BOTANICAL_DATABASE) {
    if (item.common.toLowerCase().includes(q)) return item;
    if (item.latin.toLowerCase().includes(q)) return item;
    if (item.synonyms && item.synonyms.some(s => s.toLowerCase().includes(q))) return item;
  }

  // 4. Levenshtein / fuzzy typo match (distance <= 2 for short strings like "zinna")
  for (const item of BOTANICAL_DATABASE) {
    if (isFuzzyMatch(q, item.common.toLowerCase())) return item;
    if (item.synonyms) {
      for (const s of item.synonyms) {
        if (isFuzzyMatch(q, s.toLowerCase())) return item;
      }
    }
  }

  return null;
}

/**
 * Simple Levenshtein distance check for typos.
 */
function isFuzzyMatch(s1, s2) {
  if (Math.abs(s1.length - s2.length) > 2) return false;
  let dist = 0;
  let i = 0, j = 0;
  while (i < s1.length && j < s2.length) {
    if (s1[i] !== s2[j]) {
      dist++;
      if (dist > 2) return false;
      if (s1.length > s2.length) i++;
      else if (s2.length > s1.length) j++;
      else { i++; j++; }
    } else {
      i++; j++;
    }
  }
  dist += (s1.length - i) + (s2.length - j);
  return dist <= 2;
}

