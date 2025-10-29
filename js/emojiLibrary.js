// Emoji Library for P4RS3LT0NGV3

// Create namespace for emoji library
window.emojiLibrary = {};

// Polyfill for Intl.Segmenter if not available
if (!Intl.Segmenter) {
    console.warn('Intl.Segmenter not available, falling back to basic character splitting');
}

// Helper function to properly split text into grapheme clusters (emojis)
window.emojiLibrary.splitEmojis = function(text) {
    if (Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(text), ({ segment }) => segment);
    }
    return Array.from(text);
};

// Helper function to properly join emojis
window.emojiLibrary.joinEmojis = function(emojis) {
    return emojis.join('');
};

// Additional emojis for expanded library
window.emojiLibrary.ADDITIONAL_EMOJIS = [
    // Animals & Nature
    "🐇", "🦊", "🦁", "🐯", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🕷️", "🦂", "🦟", "🦠", "🦨", "🦩", "🦫", "🦬", "🐻‍❄️", "🐼", "🐨", "🐕", "🐶", "🐩", "🐈", "🐱", "🪱",
    
    // Food & Drink
    "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🍔", "🍕", "🍖", "🍗", "🍤", "🍣", "🍱", "🍜", "🍲", "🍥",
    
    // Travel & Places
    "🚗", "🚕", "🚙", "🚌", "🚎", "🚒", "🚑", "🚚", "🚛", "🚜", "🚲", "🚐", "🚟", "🚡", "🚀", "🛸", "🛥️", "🏎️", "🏍️", "🚤", "🚢", "🚁", "🚂", "🚆", "🚈", "🌎", "🌏", "🌍", "🏔️", "🏕️",
    
    // Activities & Sports
    "⚽", "🏀", "🏈", "🏐", "🏉", "🎾", "🎳", "🏑", "🏒", "🏓", "🏸", "🥊", "🥋", "🥅", "🤾", "🎿", "🏄", "🏂", "🏊", "🏋️", "🤼", "🤸", "🤺", "🤽", "🤹", "🎯", "🎱", "🎽", "🚴", "🚵",
    
    // Tech & Objects
    "💻", "⌨️", "🖥️", "🖱️", "🖨️", "📱", "☎️", "📞", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "📡", "🔋", "🔌", "💡", "🏮", "🪔", "🧯", "🛢️", "💸", "💵", "💳", "💴", "💶", "💷", "💰", "💱", "💲", "💼", "💽", "💾", "💿",
    
    // Symbols
    "❤️", "💛", "💚", "💙", "💜", "💔", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💤", "💢", "💣", "💥", "💦", "💨", "💩", "💫", "💬", "🔥", "💠", "👾", "👻", "💀", "👽", "👿", "🩸",
    
    // Mystical & Fantasy
    "🧙", "🧙‍♂️", "🧙‍♀️", "🧚", "🧚‍♂️", "🧚‍♀️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧜", "🧜‍♂️", "🧜‍♀️", "👹", "👺", "👻", "👽", "👾", "🐲", "🔮", "🐍", "🐉", "🦄", "👸", "🥷", "👰", "🧔", "⚗️", "🔯", "🔱", "⚜️", "✨", "🌠", "🌋", "💎", "💐", "🍄", "🌺", "🌹", "🐭", "🐚", "🐊", "🐢", "🐇", "🐰", "🔥", "💥", "🌀", "🌈", "🌪️", "🩸", "🪱", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘",
    
    // Flags
    "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇺🇸", "🇨🇦", "🇬🇧", "🇩🇪", "🇫🇷", "🇮🇹", "🇯🇵", "🇰🇷", "🇷🇺", "🇨🇳", "🇮🇳", "🇦🇺", "🇧🇷", "🇪🇸", "🇳🇱", "🇵🇹", "🇸🇪", "🇦🇷", "🇦🇺", "🇦🇹", "🇧🇪", "🇧🇴"
];

// Make emoji list globally available
window.emojiLibrary.EMOJI_LIST = [
    // Blood drop, worm, and moon emojis
    "🩸", // Blood Drop
    "🪱", // Worm
    "🌑", // New Moon
    "🌒", // Waxing Crescent Moon
    "🌓", // First Quarter Moon
    "🌔", // Waxing Gibbous Moon
    "🌕", // Full Moon
    "🌖", // Waning Gibbous Moon
    "🌗", // Last Quarter Moon
    "🌘", // Waning Crescent Moon
    // Faces and People
    "😀", // Grinning Face
    "😁", // Beaming Face with Smiling Eyes
    "😂", // Face with Tears of Joy
    "🤣", // Rolling on the Floor Laughing
    "😃", // Grinning Face with Big Eyes
    "😄", // Grinning Face with Smiling Eyes
    "😅", // Grinning Face with Sweat
    "😆", // Grinning Squinting Face
    "😉", // Winking Face
    "😊", // Smiling Face with Smiling Eyes
    "😋", // Face Savoring Food
    "😎", // Smiling Face with Sunglasses
    "😍", // Smiling Face with Heart-Eyes
    "😘", // Face Blowing a Kiss
    "🥰", // Smiling Face with Hearts
    "😗", // Kissing Face
    "😙", // Kissing Face with Smiling Eyes
    "😚", // Kissing Face with Closed Eyes
    "🙂", // Slightly Smiling Face
    "🤗", // Hugging Face
    "🤩", // Star-Struck
    "🤔", // Thinking Face
    "🤨", // Face with Raised Eyebrow
    "😐", // Neutral Face
    "😑", // Expressionless Face
    "😶", // Face Without Mouth
    "🙄", // Face with Rolling Eyes
    "😏", // Smirking Face
    "😣", // Persevering Face
    "😥", // Sad but Relieved Face
    "😮", // Face with Open Mouth
    "🤐", // Zipper-Mouth Face
    "😯", // Hushed Face
    "😪", // Sleepy Face
    "😫", // Tired Face
    "😴", // Sleeping Face
    "😌", // Relieved Face
    "😛", // Face with Tongue
    "😜", // Winking Face with Tongue
    "😝", // Squinting Face with Tongue
    "🤤", // Drooling Face
    "😒", // Unamused Face
    "😓", // Downcast Face with Sweat
    "😔", // Pensive Face
    "😕", // Confused Face
    "🙃", // Upside-Down Face
    "🤑", // Money-Mouth Face
    "😲", // Astonished Face
    "🙁", // Slightly Frowning Face
    "😖", // Confounded Face
    "😞", // Disappointed Face
    "😟", // Worried Face
    "😤", // Face with Steam From Nose
    "😢", // Crying Face
    "😭", // Loudly Crying Face
    "😧", // Anguished Face
    "😨", // Fearful Face
    "😩", // Weary Face
    "🤯", // Exploding Head
    "😱", // Face Screaming in Fear
    "😳", // Flushed Face
    "🥵", // Hot Face
    "🥶", // Cold Face
    "😡", // Pouting Face
    "😠", // Angry Face
    "🤬", // Face with Symbols on Mouth
    "😷", // Face with Medical Mask
    "🤒", // Face with Thermometer
    "🤕", // Face with Head-Bandage
    "🤢", // Nauseated Face
    "🤮", // Face Vomiting
    "🤧", // Sneezing Face
    "😇", // Smiling Face with Halo
    "🥳", // Partying Face
    "🥴", // Woozy Face
    "🥺", // Pleading Face
    "🧐", // Face with Monocle
    "🥱", // Yawning Face
    "🧠", // Brain
    
    // Gestures and Body Parts
    "👍", // Thumbs Up
    "👎", // Thumbs Down
    "👏", // Clapping Hands
    "🙌", // Raising Hands
    "🤝", // Handshake
    "👋", // Waving Hand
    "✌️", // Victory Hand
    "🤟", // Love-You Gesture
    "🤘", // Sign of the Horns
    "👊", // Oncoming Fist
    "✊", // Raised Fist
    "👆", // Backhand Index Pointing Up
    "👇", // Backhand Index Pointing Down
    "👈", // Backhand Index Pointing Left
    "👉", // Backhand Index Pointing Right
    "👌", // OK Hand
    "🤌", // Pinched Fingers
    "🤏", // Pinching Hand
    "✋", // Raised Hand
    "🤚", // Raised Back of Hand
    "🖐️", // Hand with Fingers Splayed
    "🖖", // Vulcan Salute
    "👀", // Eyes
    "👁️", // Eye
    "👄", // Mouth
    "🧿", // Nazar Amulet
    
    // Celebration & Objects
    "🎉", // Party Popper
    "🎊", // Confetti Ball
    "🎂", // Birthday Cake
    "🎁", // Wrapped Gift
    "🎈", // Balloon
    "🎄", // Christmas Tree
    "🎃", // Jack-O-Lantern
    "🏆", // Trophy
    "🏅", // Sports Medal
    "🥇", // 1st Place Medal
    "🥈", // 2nd Place Medal
    "🥉", // 3rd Place Medal
    "💰", // Money Bag
    "💸", // Money with Wings
    "💵", // Dollar Banknote
    "💴", // Yen Banknote
    "💶", // Euro Banknote
    "💷", // Pound Banknote
    "💯", // Hundred Points
    "📱", // Mobile Phone
    "💻", // Laptop
    "⌨️", // Keyboard
    "🖥️", // Desktop Computer
    "🔒", // Locked
    "🔓", // Unlocked
    
    // Food & Drink
    "🍕", // Pizza
    "🍔", // Hamburger
    "🍦", // Ice Cream
    "🍩", // Doughnut
    "🍺", // Beer Mug
    "🍷", // Wine Glass
    "☕", // Hot Beverage
    
    // Nature & Weather
    "🌈", // Rainbow
    "🌞", // Sun with Face
    "🌑", // New Moon
    "🌒", // Waxing Crescent Moon
    "🌓", // First Quarter Moon
    "🌔", // Waxing Gibbous Moon
    "🌕", // Full Moon
    "🌖", // Waning Gibbous Moon
    "🌗", // Last Quarter Moon
    "🌘", // Waning Crescent Moon
    "🌙", // Crescent Moon
    "⭐", // Star
    "🌟", // Glowing Star
    "⚡", // High Voltage
    "❄️", // Snowflake
    "🔥", // Fire
    "💧", // Droplet
    "🌊", // Water Wave
    
    // Animals
    "🐇", // Follow The
    "🐱", // Cat Face
    "🐶", // Dog Face
    "🪱", // Worm
    "🦊", // Fox
    "🐼", // Panda
    "🦁", // Lion
    "🐬", // Dolphin
    "🦄", // Unicorn
    
    // Symbols & Special
    "❤️", // Red Heart
    "🩸", // Blood Drop
    "🧡", // Orange Heart
    "💚", // Green Heart
    "💙", // Blue Heart
    "💜", // Purple Heart
    "🚀", // Rocket
    "👀", // Eyes
    "💀", // Skull
    "🥹", // Face Holding Back Tears
    "🐍", // Snake
    "🐉", // Dragon
    "🐲", // Dragon Face
    "🧙‍♂️", // Wizard 
    "🪄", // Magic Wand 
    "🏴‍☠️", // Pirate Flag
    "🦅", // Eagle (often associated with pirates)
    "🦜", // Parrot (pirate symbol)
    "💻", // Laptop (hacker symbol)
    "🕶️", // Sunglasses (cool guy symbol)
    "🧑‍💻", // Technologist
    "👨‍💻", // Man Technologist
    "👩‍💻", // Woman Technologist
    "🕵️", // Detective
    "🕵️‍♂️", // Man Detective
    "🕵️‍♀️", // Woman Detective
    "🖥️", // Desktop Computer
    "⌨️", // Keyboard
    "🖱️", // Computer Mouse
    "🕹️", // Joystick
    "📱", // Mobile Phone
    "📲", // Mobile Phone with Arrow
    "🔓", // Unlocked (hacker symbol)
    "🔑", // Key (hacker symbol)
    "🗝️", // Old Key (hacker symbol)
    "🛡️", // Shield (hacker symbol)
    "⚔️", // Crossed Swords (hacker symbol)
    "🧬", // DNA (hacker symbol)
    "🧫", // Petri Dish (hacker symbol)
    "🧪", // Test Tube (hacker symbol)
    "🛠️", // Hammer and Wrench (hacker symbol)
    "⚙️", // Gear (hacker symbol)
    "🧰", // Toolbox (hacker symbol)
    "🧲", // Magnet (hacker symbol)
    "💣", // Bomb (hacker symbol)
    "🕳️", // Hole (hacker symbol)
    "📡", // Satellite Antenna (hacker symbol)
    "🛰️", // Satellite (hacker symbol)
    "📞", // Telephone Receiver (hacker symbol)
    "☎️", // Telephone (hacker symbol)
    "📟", // Pager (hacker symbol)
    "📠", // Fax Machine (hacker symbol)
    "🔌", // Electric Plug (hacker symbol)
    "💡", // Light Bulb (hacker symbol)
    "🔦", // Flashlight (hacker symbol)
    "🕯️", // Candle (hacker symbol)
    "🗞️", // Rolled-Up Newspaper (hacker symbol)
    "📜", // Scroll (hacker symbol)
    "📃", // Page with Curl (hacker symbol)
    "📄", // Page Facing Up (hacker symbol)
    "📑", // Bookmark Tabs (hacker symbol)
    "📊", // Bar Chart (hacker symbol)
    "📈", // Chart Increasing (hacker symbol)
    "📉", // Chart Decreasing (hacker symbol)
    "🗂️", // Card Index Dividers (hacker symbol)
    "🗃️", // Card File Box (hacker symbol)
    "🗄️", // File Cabinet (hacker symbol)
    "🗑️", // Wastebasket (hacker symbol)
    "🛢️", // Oil Drum (hacker symbol)
    "🛎️", // Bellhop Bell (hacker symbol)
    "🧳", // Luggage (hacker symbol)
    "🛌", // Person in Bed (hacker symbol)
    "🛏️", // Bed (hacker symbol)
    "🛋️", // Couch and Lamp (hacker symbol)
    "🪑", // Chair (hacker symbol)
    "🚪", // Door (hacker symbol)
    "🧴", // Lotion Bottle (hacker symbol)
    "🧷", // Safety Pin (hacker symbol)
    "🧹", // Broom (hacker symbol)
    "🧺", // Basket (hacker symbol)
    "🧻", // Roll of Paper (hacker symbol)
    "🧼", // Soap (hacker symbol)
    "🧽", // Sponge (hacker symbol)
    "🧯", // Fire Extinguisher (hacker symbol)
    "🛒", // Shopping Cart (hacker symbol)
    "🚬", // Cigarette (hacker symbol)
    "⚰️", // Coffin (hacker symbol)
    "⚱️", // Funeral Urn (hacker symbol)
    "🗿", // Moai (hacker symbol)
    "🛂", // Passport Control (hacker symbol)
    "🛃", // Customs (hacker symbol)
    "🛄", // Baggage Claim (hacker symbol)
    "🛅", // Left Luggage (hacker symbol)
    "🚹", // Men's Room (hacker symbol)
    "🚺", // Women's Room (hacker symbol)
    "🚼", // Baby Symbol (hacker symbol)
    "🚻", // Restroom (hacker symbol)
    "🚮", // Litter in Bin Sign (hacker symbol)
    "🚰", // Potable Water (hacker symbol)
    "🚾", // Water Closet (hacker symbol)
    "🚭", // No Smoking (hacker symbol)
    "🚯", // No Littering (hacker symbol)
    "🚱", // Non-Potable Water (hacker symbol)
    
    // Additional Smileys & Emotion
    "😊", // Smiling Face with Smiling Eyes
    "😇", // Smiling Face with Halo
    "🙂", // Slightly Smiling Face
    "🙃", // Upside-Down Face
    "😉", // Winking Face
    "😌", // Relieved Face
    "😍", // Smiling Face with Heart-Eyes
    "🥰", // Smiling Face with Hearts
    "😘", // Face Blowing a Kiss
    "😗", // Kissing Face
    "😙", // Kissing Face with Smiling Eyes
    "😚", // Kissing Face with Closed Eyes
    "😋", // Face Savoring Food
    "😛", // Face with Tongue
    "😝", // Squinting Face with Tongue
    "😜", // Winking Face with Tongue
    "🤪", // Zany Face
    
    // Additional People & Body
    "🧑‍🚀", // Astronaut
    "👨‍🚀", // Man Astronaut
    "👩‍🚀", // Woman Astronaut
    "🧑‍🔬", // Scientist
    "👨‍🔬", // Man Scientist
    "👩‍🔬", // Woman Scientist
    "🧑‍⚕️", // Health Worker
    "👨‍⚕️", // Man Health Worker
    "👩‍⚕️", // Woman Health Worker
    "🧑‍🔧", // Mechanic
    "👨‍🔧", // Man Mechanic
    "👩‍🔧", // Woman Mechanic
    "🧑‍🚒", // Firefighter
    "👨‍🚒", // Man Firefighter
    "👩‍🚒", // Woman Firefighter
    
    // Additional Animals & Nature
    "🦒", // Giraffe
    "🦓", // Zebra
    "🦬", // Bison
    "🦙", // Llama
    "🦘", // Kangaroo
    "🦥", // Sloth
    "🦦", // Otter
    "🦡", // Badger
    "🦔", // Hedgehog
    "🦝", // Raccoon
    "🐿️", // Chipmunk
    "🦫", // Beaver
    "🦎", // Lizard
    "🐊", // Crocodile
    "🐢", // Turtle
    "🦕", // Sauropod
    "🦖", // T-Rex
    "🐋", // Whale
    "🐬", // Dolphin
    "🦭", // Seal
    
    // Additional Food & Drink
    "🥞", // Pancakes
    "🧇", // Waffle
    "🧀", // Cheese Wedge
    "🍖", // Meat on Bone
    "🍗", // Poultry Leg
    "🥩", // Cut of Meat
    "🥓", // Bacon
    "🍔", // Hamburger
    "🍟", // French Fries
    "🍕", // Pizza
    "🌭", // Hot Dog
    "🥪", // Sandwich
    "🌮", // Taco
    "🌯", // Burrito
    "🥙", // Stuffed Flatbread
    "🧆", // Falafel
    "🥚", // Egg
    "🍳", // Cooking
    "🥘", // Shallow Pan of Food
    "🍲", // Pot of Food
    
    // Additional Travel & Places
    "🏙️", // Cityscape
    "🌆", // Cityscape at Dusk
    "🌇", // Sunset
    "🌃", // Night with Stars
    "🌉", // Bridge at Night
    "🏞️", // National Park
    "🏜️", // Desert
    "🏝️", // Desert Island
    "🏖️", // Beach with Umbrella
    "⛰️", // Mountain
    "🏔️", // Snow-Capped Mountain
    "🌋", // Volcano
    "🗻", // Mount Fuji
    "🏠", // House
    "🏡", // House with Garden
    "🏢", // Office Building
    "🏣", // Japanese Post Office
    "🏤", // Post Office
    "🏥", // Hospital
    "🏦", // Bank
    
    // Additional Flags
    "🇺🇸", // United States
    "🇬🇧", // United Kingdom
    "🇨🇦", // Canada
    "🇯🇵", // Japan
    "🇩🇪", // Germany
    "🇫🇷", // France
    "🇮🇹", // Italy
    "🇪🇸", // Spain
    "🇷🇺", // Russia
    "🇨🇳", // China
    "🇮🇳", // India
    "🇧🇷", // Brazil
    "🇦🇺", // Australia
    "🇲🇽", // Mexico
    "🇰🇷", // South Korea
    "🇿🇦", // South Africa
    "🇸🇪", // Sweden
    "🇳🇴", // Norway
    "🇳🇿", // New Zealand
    "🇮🇪", // Ireland
];

// Define emoji categories with specific emojis for each category
window.emojiLibrary.EMOJIS = {
    faces_people: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😧", "😨", "😩", "🤯", "😱", "😳", "🥵", "🥶", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥴", "🥺", "🧐", "🥱", "🧠", "🤠", "🥸", "🤡", "🤓", "😈", "👿", "👹", "👺", "💀", "☠️", "👻", "👽", "👾", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊", "👶", "🧒", "👦", "👧", "🧑", "👨", "👩", "🧔", "👴", "👵", "🧓", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", "👩‍🦰", "👩‍🦱", "👩‍🦳", "👩‍🦲"],

    gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "🖕", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤏", "👐", "🙌", "👏", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "🩸", "🫀", "🫁", "🧬", "🦠", "👣", "🤲", "🙌", "👐", "🤝", "🤜", "🤛", "✊", "👊", "🤌", "🫰", "🫱", "🫲", "🫳", "🫴", "🫵", "🫶"],

    animals_nature: ["🐇", "🦊", "🦁", "🐯", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🕷️", "🦂", "🐍", "🦨", "🦩", "🦫", "🦬", "🐻‍❄️", "🐼", "🐨", "🐕", "🐶", "🐩", "🐈", "🐱", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🦬", "🐃", "🐂", "🐄", "🐎", "🦄", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕‍🦺", "🐩", "🐈‍⬛", "🦮", "🐕", "🐅", "🐆", "🦝", "🦡", "🦫", "🦦", "🦥", "🐀", "🐁", "🐭", "🐹", "🐰", "🐇", "🐿️", "🦔", "🦇", "🐻", "🐨", "🐼", "🦘", "🦡", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦅", "🦆", "🦢", "🦉", "🦤", "🪶", "🦩", "🦚", "🦜", "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕", "🦖"],

    food_drink: ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🥤", "🧃", "🧉", "🧊", "🥢", "🍽️", "🍴", "🥄", "🔪", "🏺"],

    travel_places: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍️", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚁", "🛸", "🚀", "🛶", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "⚓", "⛽", "🚧", "🚦", "🚥", "🚏", "🗺️", "🗿", "🗽", "🗼", "🏰", "🏯", "🏟️", "🎡", "🎢", "🎠", "⛲", "⛱️", "🏖️", "🏝️", "🏜️", "🌋", "⛰️", "🏔️", "🗻", "🏕️", "⛺", "🏠", "🏡", "🏘️", "🏚️", "🏗️", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛️", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "♨️", "🎠", "🎡", "🎢", "💈", "🎪"],

    activities_sports: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "🤺", "⛹️", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚵", "🚴", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️", "🎫", "🎟️", "🎪", "🤹", "🎭", "🩰", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🪘", "🎷", "🎺", "🪗", "🎸", "🪕", "🎻", "🎲", "♟️", "🎯", "🎳", "🎮", "🎰", "🧩"],

    technology_objects: ["💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🪛", "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🪓", "🪚", "🔩", "⚙️", "🗜️", "⛓️", "🪝", "🧲", "🔫", "💣", "🧨", "🪃", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "🪦", "⚱️", "🏺", "🔮", "📿", "🧿", "💈", "⚗️", "🔭", "🔬", "🕳️", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠", "🧫", "🧪", "🌡️", "🧹", "🪠", "🧺", "🧻", "🪣", "🧼", "🪥", "🧽", "🧴", "🛎️", "🔑", "🗝️", "🚪", "🪑", "🛋️", "🛏️", "🛌", "🧸", "🪆", "🖼️", "🪞", "🪟", "🛍️", "🛒", "🎁", "🎈", "🎏", "🎀", "🪄", "🪅", "🎊", "🎉", "🎎", "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷️", "🪧", "📪", "📫", "📬", "📭", "📮", "📯", "📜", "📃", "📄", "📑", "🧾", "📊", "📈", "📉", "🗒️", "🗓️", "📆", "📅", "🗑️", "📇", "🗃️", "🗳️", "🗄️", "📋", "📁", "📂", "🗂️", "🗞️", "📰", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "🧷", "🔗", "📎", "🖇️", "📐", "📏", "🧮", "📌", "📍", "✂️", "🖊️", "🖋️", "✒️", "🖌️", "🖍️", "📝", "✏️", "🔍", "🔎", "🔏", "🔐", "🔒", "🔓"],

    mystical_fantasy: ["🧙", "🧙‍♂️", "🧙‍♀️", "🧚", "🧚‍♂️", "🧚‍♀️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧜", "🧜‍♂️", "🧜‍♀️", "🧝", "🧝‍♂️", "🧝‍♀️", "🧞", "🧞‍♂️", "🧞‍♀️", "🧟", "🧟‍♂️", "🧟‍♀️", "👹", "👺", "👻", "👽", "👾", "🐲", "🐉", "🦄", "🦇", "🕷️", "🕸️", "🔮", "🪄", "⚗️", "🧿", "🪬", "🔯", "✡️", "☸️", "☯️", "✝️", "☦️", "☪️", "🕉️", "☮️", "🕎", "🔱", "⚜️", "🔰", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎", "✨", "🌠", "💫", "⭐", "🌟", "💥", "💢", "💦", "💨", "🌀", "🌈", "🌪️", "🌋", "💎", "🩸", "⚡", "🔥", "❄️", "💧", "🌊", "🪐", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "☀️", "🌝", "🌞"],

    nature_weather: ["🌈", "🌞", "🌝", "🌛", "🌜", "🌚", "🌙", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "⭐", "🌟", "💫", "✨", "🌠", "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️", "⛄", "🌬️", "💨", "🌪️", "🌫️", "🌊", "💧", "💦", "☔", "☂️", "🌸", "💮", "🏵️", "🌹", "🥀", "🌺", "🌻", "🌼", "🌷", "🌱", "🪴", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🪹", "🪺", "🍄", "⚡", "🔥", "🌋", "🏔️", "⛰️", "🗻", "🪨", "🌎", "🌍", "🌏", "🌐", "🗺️", "🧭", "⛲", "🌅", "🌄", "🌠", "🎆", "🎇", "🌃", "🌌", "🌉", "🌁"],

    spiritual_religious: ["☮️", "✝️", "☦️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "🙏", "🧘", "🧘‍♂️", "🧘‍♀️", "📿", "🪔", "🕯️", "💒", "⚛️", "🕉️", "☸️", "☯️", "✝️", "☦️", "☪️", "✡️", "🔯", "🕎", "☮️", "🕊️", "🤲", "🙌", "👐", "🤝", "🙏", "✨", "💫", "🌟", "⭐", "🌠", "🌌", "🔮", "🧿", "🪬", "📿", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎"],

    symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳", "🈶", "🈚", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️", "㊗️", "🈴", "🈵", "🈹", "🈲", "🅰️", "🅱️", "🆎", "🆑", "🅾️", "🆘", "❌", "⭕", "🛑", "⛔", "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳", "🚱", "🔞", "📵", "🚭", "❗", "❕", "❓", "❔", "‼️", "⁉️", "🔅", "🔆", "〽️", "⚠️", "🚸", "🔱", "⚜️", "🔰", "♻️", "✅", "🈯", "💹", "❇️", "✳️", "❎", "🌐", "💠", "Ⓜ️", "🌀", "💤", "🏧", "🚾", "♿", "🅿️", "🛗", "🈳", "🈂️", "🛂", "🛃", "🛄", "🛅", "🚹", "🚺", "🚼", "⚧️", "🚻", "🚮", "🎦", "📶", "🈁", "🔣", "ℹ️", "🔤", "🔡", "🔠", "🆖", "🆗", "🆙", "🆒", "🆕", "🆓", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔢", "#️⃣", "*️⃣", "⏏️", "▶️", "⏸️", "⏯️", "⏹️", "⏺️", "⏭️", "⏮️", "⏩", "⏪", "⏫", "⏬", "◀️", "🔼", "🔽", "➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️", "↖️", "↕️", "↔️", "↪️", "↩️", "⤴️", "⤵️", "🔀", "🔁", "🔂", "🔄", "🔃", "🎵", "🎶", "➕", "➖", "➗", "✖️", "♾️", "💲", "💱", "™️", "©️", "®️", "〰️", "➰", "➿", "🔚", "🔙", "🔛", "🔝", "🔜", "✔️", "☑️", "🔘", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔺", "🔻", "🔸", "🔹", "🔶", "🔷", "🔳", "🔲", "▪️", "▫️", "◾", "◽", "◼️", "◻️", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "⬛", "⬜", "🟫", "🔈", "🔇", "🔉", "🔊", "🔔", "🔕", "📣", "📢", "👁️‍🗨️", "💬", "💭", "🗯️", "♠️", "♣️", "♥️", "♦️", "🃏", "🎴", "🀄", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "🕜", "🕝", "🕞", "🕟", "🕠", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦", "🕧"],

    flags: ["🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦🇨", "🇦🇩", "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶", "🇦🇷", "🇦🇸", "🇦🇹", "🇦🇺", "🇦🇼", "🇦🇽", "🇦🇿", "🇧🇦", "🇧🇧", "🇧🇩", "🇧🇪", "🇧🇫", "🇧🇬", "🇧🇭", "🇧🇮", "🇧🇯", "🇧🇱", "🇧🇲", "🇧🇳", "🇧🇴", "🇧🇶", "🇧🇷", "🇧🇸", "🇧🇹", "🇧🇻", "🇧🇼", "🇧🇾", "🇧🇿", "🇨🇦", "🇨🇨", "🇨🇩", "🇨🇫", "🇨🇬", "🇨🇭", "🇨🇮", "🇨🇰", "🇨🇱", "🇨🇲", "🇨🇳", "🇨🇴", "🇨🇵", "🇨🇷", "🇨🇺", "🇨🇻", "🇨🇼", "🇨🇽", "🇨🇾", "🇨🇿", "🇩🇪", "🇩🇬", "🇩🇯", "🇩🇰", "🇩🇲", "🇩🇴", "🇩🇿", "🇪🇦", "🇪🇨", "🇪🇪", "🇪🇬", "🇪🇭", "🇪🇷", "🇪🇸", "🇪🇹", "🇪🇺", "🇫🇮", "🇫🇯", "🇫🇰", "🇫🇲", "🇫🇴", "🇫🇷", "🇬🇦", "🇬🇧", "🇬🇩", "🇬🇪", "🇬🇫", "🇬🇬", "🇬🇭", "🇬🇮", "🇬🇱", "🇬🇲", "🇬🇳", "🇬🇵", "🇬🇶", "🇬🇷", "🇬🇸", "🇬🇹", "🇬🇺", "🇬🇼", "🇬🇾", "🇭🇰", "🇭🇲", "🇭🇳", "🇭🇷", "🇭🇹", "🇭🇺", "🇮🇨", "🇮🇩", "🇮🇪", "🇮🇱", "🇮🇲", "🇮🇳", "🇮🇴", "🇮🇶", "🇮🇷", "🇮🇸", "🇮🇹", "🇯🇪", "🇯🇲", "🇯🇴", "🇯🇵", "🇰🇪", "🇰🇬", "🇰🇭", "🇰🇮", "🇰🇲", "🇰🇳", "🇰🇵", "🇰🇷", "🇰🇼", "🇰🇾", "🇰🇿", "🇱🇦", "🇱🇧", "🇱🇨", "🇱🇮", "🇱🇰", "🇱🇷", "🇱🇸", "🇱🇹", "🇱🇺", "🇱🇻", "🇱🇾", "🇲🇦", "🇲🇨", "🇲🇩", "🇲🇪", "🇲🇫", "🇲🇬", "🇲🇭", "🇲🇰", "🇲🇱", "🇲🇲", "🇲🇳", "🇲🇴", "🇲🇵", "🇲🇶", "🇲🇷", "🇲🇸", "🇲🇹", "🇲🇺", "🇲🇻", "🇲🇼", "🇲🇽", "🇲🇾", "🇲🇿", "🇳🇦", "🇳🇨", "🇳🇪", "🇳🇫", "🇳🇬", "🇳🇮", "🇳🇱", "🇳🇴", "🇳🇵", "🇳🇷", "🇳🇺", "🇳🇿", "🇴🇲", "🇵🇦", "🇵🇪", "🇵🇫", "🇵🇬", "🇵🇭", "🇵🇰", "🇵🇱", "🇵🇲", "🇵🇳", "🇵🇷", "🇵🇸", "🇵🇹", "🇵🇼", "🇵🇾", "🇶🇦", "🇷🇪", "🇷🇴", "🇷🇸", "🇷🇺", "🇷🇼", "🇸🇦", "🇸🇧", "🇸🇨", "🇸🇩", "🇸🇪", "🇸🇬", "🇸🇭", "🇸🇮", "🇸🇯", "🇸🇰", "🇸🇱", "🇸🇲", "🇸🇳", "🇸🇴", "🇸🇷", "🇸🇸", "🇸🇹", "🇸🇻", "🇸🇽", "🇸🇾", "🇸🇿", "🇹🇦", "🇹🇨", "🇹🇩", "🇹🇫", "🇹🇬", "🇹🇭", "🇹🇯", "🇹🇰", "🇹🇱", "🇹🇲", "🇹🇳", "🇹🇴", "🇹🇷", "🇹🇹", "🇹🇻", "🇹🇼", "🇹🇿", "🇺🇦", "🇺🇬", "🇺🇲", "🇺🇳", "🇺🇸", "🇺🇾", "🇺🇿", "🇻🇦", "🇻🇨", "🇻🇪", "🇻🇬", "🇻🇮", "🇻🇳", "🇻🇺", "🇼🇫", "🇼🇸", "🇽🇰", "🇾🇪", "🇾🇹", "🇿🇦", "🇿🇲", "🇿🇼", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "🏴󠁧󠁢󠁷󠁬󠁳󠁿"]
};

// Define standard emoji categories
window.emojiLibrary.CATEGORIES = [
    { id: 'all', name: 'All Emojis', icon: '🔍' },
    { id: 'faces_people', name: 'Faces & People', icon: '😀' },
    { id: 'gestures', name: 'Gestures & Body', icon: '👍' },
    { id: 'animals_nature', name: 'Animals & Creatures', icon: '🦊' },
    { id: 'food_drink', name: 'Food & Drink', icon: '🍕' },
    { id: 'travel_places', name: 'Travel & Places', icon: '✈️' },
    { id: 'activities_sports', name: 'Activities & Sports', icon: '⚽' },
    { id: 'technology_objects', name: 'Tech & Objects', icon: '💻' },
    { id: 'mystical_fantasy', name: 'Mystical & Fantasy', icon: '🧙' },
    { id: 'nature_weather', name: 'Nature & Weather', icon: '🌈' },
    { id: 'spiritual_religious', name: 'Spiritual & Religious', icon: '🕉️' },
    { id: 'symbols', name: 'Symbols & Signs', icon: '❤️' },
    { id: 'flags', name: 'Flags', icon: '🏁' }
];

// Function to render emoji grid with categories
window.emojiLibrary.renderEmojiGrid = function(containerId, onEmojiSelect, filteredList) {
    console.log('Rendering emoji grid to:', containerId);
    
    // Get container by ID
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Add header with instruction message
    const emojiHeader = document.createElement('div');
    emojiHeader.className = 'emoji-header';
    emojiHeader.innerHTML = '<h3><i class="fas fa-icons"></i> Choose an Emoji</h3><p class="emoji-subtitle"><i class="fas fa-magic"></i> Click any emoji to copy your hidden message</p>';
    container.appendChild(emojiHeader);
    
    // Create category tabs
    const categoryTabs = document.createElement('div');
    categoryTabs.className = 'emoji-category-tabs';
    
    // Add category tabs
    window.emojiLibrary.CATEGORIES.forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'emoji-category-tab';
        if (category.id === 'all') {
            tab.classList.add('active');
        }
        tab.setAttribute('data-category', category.id);
        tab.innerHTML = `${category.icon} ${category.name}`;
        categoryTabs.appendChild(tab);
    });
    
    container.appendChild(categoryTabs);
    
    // Create emoji grid with enforced styling
    const gridContainer = document.createElement('div');
    gridContainer.className = 'emoji-grid';
    
    // Get the active category
    let activeCategory = 'all';
    const activeCategoryTab = container.querySelector('.emoji-category-tab.active');
    if (activeCategoryTab) {
        activeCategory = activeCategoryTab.getAttribute('data-category');
    }
    
    // Determine which emojis to show based on category and filter
    let emojisToShow = [];
    
    if (filteredList && filteredList.length > 0) {
        // If we have a filtered list (from search), use that
        emojisToShow = filteredList;
    } else if (activeCategory === 'all') {
        // For 'all' category, combine all emojis from the categories
        Object.values(window.emojiLibrary.EMOJIS).forEach(categoryEmojis => {
            emojisToShow = [...emojisToShow, ...categoryEmojis];
        });
    } else if (window.emojiLibrary.EMOJIS[activeCategory]) {
        // For specific category, use emojis from that category
        emojisToShow = window.emojiLibrary.EMOJIS[activeCategory];
    }
    
    console.log(`Adding ${emojisToShow.length} emojis to grid for category: ${activeCategory}`);
    
    // Add emojis to grid with enforced styling
    emojisToShow.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.className = 'emoji-button';
        emojiButton.textContent = emoji; // Use textContent for better emoji handling
        emojiButton.title = 'Click to encode with this emoji';
        
        emojiButton.addEventListener('click', () => {
            if (typeof onEmojiSelect === 'function') {
                onEmojiSelect(emoji);
                // Add visual feedback when clicked
                emojiButton.style.backgroundColor = '#e6f7ff';
                setTimeout(() => {
                    emojiButton.style.backgroundColor = '';
                }, 300);
            }
        });
        
        gridContainer.appendChild(emojiButton);
    });
    
    container.appendChild(gridContainer);
    console.log('Emoji grid rendering complete');
    
    // Add event listeners to category tabs
    const categoryTabButtons = container.querySelectorAll('.emoji-category-tab');
    categoryTabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            categoryTabButtons.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Get the selected category
            const selectedCategory = tab.getAttribute('data-category');
            console.log('Category selected:', selectedCategory);

            // Determine which emojis to show
            let emojisToShow = [];
            if (selectedCategory === 'all') {
                // For 'all' category, combine all emojis from the categories
                Object.values(window.emojiLibrary.EMOJIS).forEach(categoryEmojis => {
                    emojisToShow = [...emojisToShow, ...categoryEmojis];
                });
            } else if (window.emojiLibrary.EMOJIS[selectedCategory]) {
                // For specific category, use emojis from that category
                emojisToShow = window.emojiLibrary.EMOJIS[selectedCategory];
            }

            console.log(`Updating grid with ${emojisToShow.length} emojis for category: ${selectedCategory}`);

            // Clear only the grid and rebuild it
            gridContainer.innerHTML = '';

            // Add emojis to grid
            emojisToShow.forEach(emoji => {
                const emojiButton = document.createElement('button');
                emojiButton.className = 'emoji-button';
                emojiButton.textContent = emoji;
                emojiButton.title = 'Click to encode with this emoji';

                emojiButton.addEventListener('click', () => {
                    if (typeof onEmojiSelect === 'function') {
                        onEmojiSelect(emoji);
                        // Add visual feedback when clicked
                        emojiButton.style.backgroundColor = '#e6f7ff';
                        setTimeout(() => {
                            emojiButton.style.backgroundColor = '';
                        }, 300);
                    }
                });

                gridContainer.appendChild(emojiButton);
            });
        });
    });
    
    // Debug info - add count display
    const countDisplay = document.createElement('div');
    countDisplay.className = 'emoji-count';
    countDisplay.textContent = `${emojisToShow.length} emojis available`;
    container.appendChild(countDisplay);
};
