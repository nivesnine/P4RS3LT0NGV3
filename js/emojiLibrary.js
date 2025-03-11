// Emoji Library for P4RS3LT0NGV3

// Create namespace for emoji library
window.emojiLibrary = {};

// Additional emojis for expanded library
window.emojiLibrary.ADDITIONAL_EMOJIS = [
    // Animals & Nature
    "🦊", "🦁", "🐯", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🕷️", "🦂", "🦟", "🦠", "🦨", "🦩", "🦫", "🦬", "🐻‍❄️", "🐼", "🐨", "🐕", "🐶", "🐩", "🐈", "🐱",
    
    // Food & Drink
    "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🍔", "🍕", "🍖", "🍗", "🍤", "🍣", "🍱", "🍜", "🍲", "🍥",
    
    // Travel & Places
    "🚗", "🚕", "🚙", "🚌", "🚎", "🚒", "🚑", "🚚", "🚛", "🚜", "🚲", "🚐", "🚟", "🚡", "🚀", "🛸", "🛥️", "🏎️", "🏍️", "🚤", "🚢", "🚁", "🚂", "🚆", "🚈", "🌎", "🌏", "🌍", "🏔️", "🏕️",
    
    // Activities & Sports
    "⚽", "🏀", "🏈", "🏐", "🏉", "🎾", "🎳", "🏑", "🏒", "🏓", "🏸", "🥊", "🥋", "🥅", "🤾", "🎿", "🏄", "🏂", "🏊", "🏋️", "🤼", "🤸", "🤺", "🤽", "🤹", "🎯", "🎱", "🎽", "🚴", "🚵",
    
    // Tech & Objects
    "💻", "⌨️", "🖥️", "🖱️", "🖨️", "📱", "☎️", "📞", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "📡", "🔋", "🔌", "💡", "🏮", "🪔", "🧯", "🛢️", "💸", "💵", "💳", "💴", "💶", "💷", "💰", "💱", "💲", "💼", "💽", "💾", "💿",
    
    // Symbols
    "❤️", "💛", "💚", "💙", "💜", "💔", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💤", "💢", "💣", "💥", "💦", "💨", "💩", "💫", "💬", "🔥", "💠", "👾", "👻", "💀", "👽", "👿",
    
    // Mystical & Fantasy
    "🧙", "🧙‍♂️", "🧙‍♀️", "🧚", "🧚‍♂️", "🧚‍♀️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧜", "🧜‍♂️", "🧜‍♀️", "👹", "👺", "👻", "👽", "👾", "🐲", "🔮", "🐍", "🐉", "🦄", "👸", "🥷", "👰", "🧔", "⚗️", "🔯", "🔱", "⚜️", "✨", "🌠", "🌋", "💎", "💐", "🍄", "🌺", "🌹", "🐭", "🐚", "🐊", "🐢", "🐇", "🐰", "🔥", "💥", "🌀", "🌈", "🌪️",
    
    // Flags
    "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇺🇸", "🇨🇦", "🇬🇧", "🇩🇪", "🇫🇷", "🇮🇹", "🇯🇵", "🇰🇷", "🇷🇺", "🇨🇳", "🇮🇳", "🇦🇺", "🇧🇷", "🇪🇸", "🇳🇱", "🇵🇹", "🇸🇪", "🇦🇷", "🇦🇺", "🇦🇹", "🇧🇪", "🇧🇴"
];

// Make emoji list globally available
window.emojiLibrary.EMOJI_LIST = [
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
    "🌙", // Crescent Moon
    "⭐", // Star
    "🌟", // Glowing Star
    "⚡", // High Voltage
    "❄️", // Snowflake
    "🔥", // Fire
    "💧", // Droplet
    "🌊", // Water Wave
    
    // Animals
    "🐱", // Cat Face
    "🐶", // Dog Face
    "🦊", // Fox
    "🐼", // Panda
    "🦁", // Lion
    "🐬", // Dolphin
    "🦄", // Unicorn
    
    // Symbols & Special
    "❤️", // Red Heart
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

// Define standard emoji categories using the Unicode CLDR categorization
window.emojiLibrary.CATEGORIES = [
    { id: 'all', name: 'All Emojis', icon: '🔍' },
    { id: 'smileys', name: 'Smileys & Emotion', icon: '😀' },
    { id: 'people', name: 'People & Body', icon: '👋' },
    { id: 'animals', name: 'Animals & Nature', icon: '🐵' },
    { id: 'food', name: 'Food & Drink', icon: '🍎' },
    { id: 'travel', name: 'Travel & Places', icon: '🚗' },
    { id: 'activities', name: 'Activities', icon: '⚽' },
    { id: 'objects', name: 'Objects', icon: '💡' },
    { id: 'symbols', name: 'Symbols', icon: '🔣' },
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
    
    // Create grid note
    const gridNote = document.createElement('div');
    gridNote.className = 'emoji-grid-note';
    gridNote.innerHTML = '<i class="fas fa-magic"></i> Click any emoji to automatically copy your hidden message';
    container.appendChild(gridNote);
    
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
    
    // Combine all emojis for a larger selection
    const allEmojis = [...window.emojiLibrary.EMOJI_LIST, ...window.emojiLibrary.ADDITIONAL_EMOJIS];
    
    // Use the provided filtered list if available, otherwise default to full list
    const emojisToShow = filteredList && filteredList.length > 0 ? filteredList : allEmojis;
    console.log(`Adding ${emojisToShow.length} emojis to grid`);
    
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
    
    // Helper function to categorize emojis using standard Unicode ranges
    function categorizeEmoji(emoji) {
        // Get the code point of the emoji
        const code = emoji.codePointAt(0);
        
        // Smileys & Emotion (faces, emotions, hearts)
        if ((code >= 0x1F600 && code <= 0x1F64F) || // Emoticons
            (code >= 0x1F910 && code <= 0x1F92F) || // Face-hand
            (code >= 0x1F970 && code <= 0x1F97A) || // Faces
            (code >= 0x1F9D0 && code <= 0x1F9DF) || // Faces
            (code >= 0x2763 && code <= 0x2764) || // Hearts
            (code >= 0x1F48B && code <= 0x1F49F) || // Hearts and love
            (code >= 0x1F493 && code <= 0x1F49F) || // Hearts
            emoji === '😀' || emoji === '😃' || emoji === '😄' || emoji === '😁' || emoji === '😆' || 
            emoji === '😅' || emoji === '😂' || emoji === '🤣' || emoji === '☺️' || emoji === '😊') {
            return 'smileys';
        }
        
        // People & Body (people, hands, body parts)
        if ((code >= 0x1F466 && code <= 0x1F487) || // People
            (code >= 0x1F9D1 && code <= 0x1F9DD) || // People
            (code >= 0x1F468 && code <= 0x1F469) || // Man/Woman
            (code >= 0x1F46E && code <= 0x1F9CF) || // People roles
            (code >= 0x1F44B && code <= 0x1F450) || // Hands
            (code >= 0x1F918 && code <= 0x1F91F) || // Hand symbols
            (code >= 0x1F926 && code <= 0x1F937) || // People gestures
            emoji.includes('👨') || emoji.includes('👩') || emoji.includes('🧑') || 
            emoji.includes('👶') || emoji.includes('👦') || emoji.includes('👧') || 
            emoji.includes('🧒') || emoji.includes('👴') || emoji.includes('👵') || 
            emoji.includes('🧓') || emoji.includes('👮') || emoji.includes('👷')) {
            return 'people';
        }
        
        // Animals & Nature (animals, plants, weather)
        if ((code >= 0x1F400 && code <= 0x1F43F) || // Animals
            (code >= 0x1F980 && code <= 0x1F9AF) || // Animals
            (code >= 0x1F330 && code <= 0x1F33F) || // Plants
            (code >= 0x1F340 && code <= 0x1F37F) || // More plants
            (code >= 0x1F300 && code <= 0x1F32C) || // Weather
            emoji === '🐵' || emoji === '🐒' || emoji === '🦍' || emoji === '🦧' || 
            emoji === '🐶' || emoji === '🐕' || emoji === '🦮' || emoji === '🐩' || 
            emoji === '🐺' || emoji === '🦊' || emoji === '🦝' || emoji === '🐱' || 
            emoji === '🌱' || emoji === '🌲' || emoji === '🌳' || emoji === '🌴' || 
            emoji === '🌵' || emoji === '🌷' || emoji === '🌸' || emoji === '🌹') {
            return 'animals';
        }
        
        // Food & Drink
        if ((code >= 0x1F32D && code <= 0x1F37F) || // Food items
            (code >= 0x1F95F && code <= 0x1F9AA) || // More food
            (code >= 0x1F950 && code <= 0x1F96F) || // More food
            emoji === '🍇' || emoji === '🍈' || emoji === '🍉' || emoji === '🍊' || 
            emoji === '🍋' || emoji === '🍌' || emoji === '🍍' || emoji === '🥭' || 
            emoji === '🍎' || emoji === '🍏' || emoji === '🍐' || emoji === '🍑' || 
            emoji === '🍒' || emoji === '🍓' || emoji === '🥝' || emoji === '🍅' || 
            emoji === '🥥' || emoji === '🥑' || emoji === '🍆' || emoji === '🥔') {
            return 'food';
        }
        
        // Travel & Places (transportation, buildings, maps)
        if ((code >= 0x1F680 && code <= 0x1F6FF) || // Transport
            (code >= 0x1F30D && code <= 0x1F32C) || // Earth/Weather
            (code >= 0x1F3D7 && code <= 0x1F3DB) || // Buildings
            (code >= 0x1F3E0 && code <= 0x1F3F0) || // Buildings
            (code >= 0x26E9 && code <= 0x26F5) || // Buildings/Places
            emoji === '🚗' || emoji === '🚕' || emoji === '🚙' || emoji === '🚌' || 
            emoji === '🚎' || emoji === '🏎️' || emoji === '🚓' || emoji === '🚑' || 
            emoji === '🚒' || emoji === '🚐' || emoji === '🛻' || emoji === '🚚' || 
            emoji === '🚛' || emoji === '🚜' || emoji === '🛵' || emoji === '🏍️' || 
            emoji === '🛺' || emoji === '🚲' || emoji === '🛴' || emoji === '🚏') {
            return 'travel';
        }
        
        // Activities (sports, music, arts, hobbies)
        if ((code >= 0x1F380 && code <= 0x1F3A0) || // Events
            (code >= 0x1F3A3 && code <= 0x1F3BE) || // Sports
            (code >= 0x1F3BF && code <= 0x1F3C9) || // Sports
            (code >= 0x1F3CF && code <= 0x1F3D6) || // Sports
            (code >= 0x1F3F8 && code <= 0x1F3FF) || // Activities
            (code >= 0x1F93A && code <= 0x1F94F) || // Sports
            emoji === '⚽' || emoji === '⚾' || emoji === '🏀' || emoji === '🏐' || 
            emoji === '🏈' || emoji === '🏉' || emoji === '🎾' || emoji === '🥏' || 
            emoji === '🎳' || emoji === '🏏' || emoji === '🏑' || emoji === '🏒' || 
            emoji === '🥍' || emoji === '🏓' || emoji === '🏸' || emoji === '🥊') {
            return 'activities';
        }
        
        // Objects (household, office, tools)
        if ((code >= 0x1F4A1 && code <= 0x1F4CC) || // Office
            (code >= 0x1F4D0 && code <= 0x1F4F7) || // Office/Tools
            (code >= 0x1F4FF && code <= 0x1F53D) || // Various objects
            (code >= 0x1F56F && code <= 0x1F5A4) || // Objects
            (code >= 0x1F5D1 && code <= 0x1F5FF) || // Office objects
            (code >= 0x1F6D1 && code <= 0x1F6DF) || // Misc objects
            emoji === '⌚' || emoji === '📱' || emoji === '📲' || emoji === '💻' || 
            emoji === '⌨️' || emoji === '🖥️' || emoji === '🖨️' || emoji === '🖱️' || 
            emoji === '🖲️' || emoji === '🕹️' || emoji === '🗜️' || emoji === '💽' || 
            emoji === '💾' || emoji === '💿' || emoji === '📀' || emoji === '📼') {
            return 'objects';
        }
        
        // Symbols (punctuation, alphanum, geometric, etc)
        if ((code >= 0x1F300 && code <= 0x1F320) || // Various symbols
            (code >= 0x1F170 && code <= 0x1F251) || // Enclosed characters
            (code >= 0x1F523 && code <= 0x1F5FF) || // Symbols
            (code >= 0x2600 && code <= 0x26FF) || // Misc symbols
            (code >= 0x2700 && code <= 0x27BF) || // Dingbats
            (code >= 0x1F5FB && code <= 0x1F64F) || // Symbols
            (code >= 0x1F680 && code <= 0x1F6FF) || // Transport symbols
            emoji === '💯' || emoji === '📛' || emoji === '🔰' || emoji === '⭕' || 
            emoji === '✅' || emoji === '☑️' || emoji === '✔️' || emoji === '❌' || 
            emoji === '❎' || emoji === '➰' || emoji === '➿' || emoji === '〽️' || 
            emoji === '✳️' || emoji === '✴️' || emoji === '❇️' || emoji === '©️') {
            return 'symbols';
        }
        
        // Flags (country flags, flag symbols)
        if ((code >= 0x1F1E6 && code <= 0x1F1FF) || // Regional indicators for flags
            emoji === '🏁' || emoji === '🚩' || emoji === '🎌' || emoji === '🏴' || 
            emoji.includes('🏳️') || // Flag variants
            emoji.includes('🏴') || // Flag variants
            // Check for country flags (pairs of regional indicators)
            (emoji.length >= 2 && 
             emoji.codePointAt(0) >= 0x1F1E6 && emoji.codePointAt(0) <= 0x1F1FF && 
             emoji.codePointAt(2) >= 0x1F1E6 && emoji.codePointAt(2) <= 0x1F1FF)) {
            return 'flags';
        }
        
        // Default to 'all' if we can't categorize
        return 'all';
    }
    
    // Add event listeners to category tabs with actual filtering
    document.querySelectorAll('.emoji-category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.emoji-category-tab').forEach(t => {
                t.classList.remove('active');
            });
            // Add active class to clicked tab
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            console.log('Selected category:', selectedCategory);
            
            // Get all emoji buttons
            const allEmojis = [...window.emojiLibrary.EMOJI_LIST, ...window.emojiLibrary.ADDITIONAL_EMOJIS];
            
            // Filter emojis based on selected category
            let filteredEmojis = allEmojis;
            if (selectedCategory !== 'all') {
                filteredEmojis = allEmojis.filter(emoji => {
                    const category = categorizeEmoji(emoji);
                    console.log(`Emoji: ${emoji}, Category: ${category}`);
                    return category === selectedCategory;
                });
            }
            
            // Clear and rebuild the grid with filtered emojis
            const gridContainer = container.querySelector('.emoji-grid');
            if (gridContainer) {
                // Clear existing emojis
                gridContainer.innerHTML = '';
                
                // Add filtered emojis
                filteredEmojis.forEach(emoji => {
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
                
                // Update the count display
                const countDisplay = container.querySelector('.emoji-count');
                if (countDisplay) {
                    countDisplay.textContent = `${filteredEmojis.length} emojis available`;
                }
            }
        });
    });
    
    // Debug info - add count display
    const countDisplay = document.createElement('div');
    countDisplay.className = 'emoji-count';
    countDisplay.textContent = `${emojisToShow.length} emojis available`;
    container.appendChild(countDisplay);
};
