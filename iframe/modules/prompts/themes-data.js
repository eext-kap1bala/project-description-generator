/**
 * 主题定义
 *
 * 单一真相源，由 esbuild 直接打包进 iframe/dist/bundle.js。
 * 不在运行时拉取，避免 EasyEDA IndexedDB 协议下 fetch 失败的隐患。
 *
 * 每个主题通过 fixedPromptId 引用 fixed-prompts-data.js 中的固定提示词（一对一）。
 * 多个主题可以共享同一个固定提示词（一对多）。
 *
 * 修改主题：编辑本文件后重新 npm run compile-iframe。
 */

export const THEMES = [
	{
		id: 'markdown',
		name: 'Markdown 生成器',
		description: '将文本描述转为Markdown格式',
		fixedPromptId: 'empty',
		prompt: `# 任务：将文本转换为结构化 Markdown

	* 请你扮演一个专业的编辑，将提供的文本内容转换为一份格式良好、结构清晰、重点突出的 Markdown 文档。

## A. 重点要求

	1. 忠于原文：禁止补充、删改、推断或概括；保留原文的所有文字内容；原文未提及的内容一律不可出现。
	2. 坚持到底：你是一个智能助手，请务必把用户的问题彻底解决完，然后再结束对话。只有当你确定问题完全解决了，才能结束对话。
	3. 善用工具：如果对用户发的内容或结构不确定，一定要用你的工具去读取文件并收集相关信息，绝对不要瞎猜或编造内容。
	4. 多用脑子想：你在每次排版调用之前，必须进行全面、细致、清楚的规划，并周全考虑结果。

## B. 最终输出规范 (请严格按此格式生成)

请根据你的内部推理，生成符合以下所有规范的 Markdown 文本：

1.  **主标题 (H1)**：
	* 使用 # 标题 格式，采用你在步骤 A.3 中选定的最佳标题。
2.  **内容结构**：
	* 使用不同级别的子标题（如 ##、###）来组织文章脉络，使其逻辑清晰。
	* 适当使用项目符号（-）或编号列表（1.）来呈现并列或顺序关系。
3.  **突出重点 (句子优先)**：
	* **有选择性地**使用粗体 (**) 来突出你在步骤 A.1 和 A.3 中确定的**核心论点**、**关键结论**或**金句**。
	* **优先加粗**：优先考虑加粗**能够概括要点的完整句子**或**关键短语**。
	* **避免**：避免只加粗零散的单个关键词，并**切勿过度使用粗体**，保持文档的专业性和易读性。
4.  **【!!!】重要格式规范**：
	* 在设置粗体时，**绝对不要**将任何标点符号（如 。、，、：、"、（、） 等）包含在 ** 标记内部。
	* ✅ **正确示例**(标点在 ** 之外)：这是“**一个核心观点**”。
	* ❌ **错误示例**：这是**“一个核心观点”**。
	
# 待排版的文字
`,
	},
	{
		id: 'flat',
		name: '扁平设计',
		description: '风格简洁明快，二维几何感强，并运用大胆的色块',
		fixedPromptId: 'byPrompt',
		prompt: `<design-system>
# Design Philosophy
**Flat Design** removes all artifice. It rejects the illusion of three-dimensionality—no drop shadows, no bevels, no realistic gradients, no textures. It relies entirely on **hierarchy through size, color, and typography**. This is not minimalism for the sake of being minimal; it's **confident reduction** that creates visual interest through pure form.

The aesthetic is **digital-native but print-inspired**: crisp edges, solid blocks of color, and a strict reliance on the grid. It communicates clarity, efficiency, and modernity. It is not "boring" or "plain"; it is **boldly reductive and graphic**. Every element exists because it is necessary. Visual interest comes from the strategic interplay of solid shapes, vibrant (but controlled) color palettes, and dynamic scale.

**Core Principles:**
1.  **Zero Artificial Depth**: The Z-axis does not exist. Everything is on the same plane. However, visual hierarchy is created through scale, color contrast, and strategic layering of flat shapes.
2.  **Color as Structure**: Bold background colors define sections and grouping, not lines or shadows. Color transitions are sharp, never blurred or gradual.
3.  **Typography as Interface**: Text size and weight bear the load of hierarchy. Typography is geometric, bold, and demands attention.
4.  **Geometric Purity**: Rectangles, circles, and squares dominate. Rounded corners are consistent and moderate. No organic blobs or complex shapes.
5.  **Interactive Feedback**: Hover states are pronounced through color shifts, scale transformations, and instant transitions—never through shadow depth.

# Design Token System

## Colors (Single Palette: Light Mode)
A vibrant, confident palette that avoids muddy tones. High contrast is essential.

-   **Background**: #FFFFFF (Pure White) - The canvas.
-   **Foreground**: #111827 (Gray 900) - Sharp, high-contrast text.
-   **Primary**: #3B82F6 (Blue 500) - The "Action" color. Bright, standard digital blue.
-   **Secondary**: #10B981 (Emerald 500) - Supporting accent.
-   **Accent**: #F59E0B (Amber 500) - For highlights/badges.
-   **Muted**: #F3F4F6 (Gray 100) - Used for secondary backgrounds/blocks.
-   **Border**: #E5E7EB (Gray 200) - Used sparingly.

## Typography
**Font Family**: **'Outfit', sans-serif**.
A geometric sans-serif that mirrors the shapes of the UI.
-   **Headings**: Bold (700) or Extra Bold (800). Tight letter-spacing (-0.02em).
-   **Body**: Regular (400). Readable, standard spacing.
-   **Labels/Buttons**: Medium (500) or SemiBold (600). Uppercase often used for labels (tracking-wider).

## Radius & Shapes
-   **Radius**: rounded-md (6px) or rounded-lg (8px). Consistent throughout. Not fully rounded (pill) unless it's a tag.
-   **Borders**: generally 0px. We use background colors to define edges. If a border is needed (e.g., inputs), border-2 solid color.

## Shadows & Effects
-   **Shadows**: shadow-none. **ABSOLUTELY NO BOX SHADOWS ON ELEMENTS.**
-   **Gradients**: Only subtle directional gradients for background decoration (e.g., from-[#F3F4F6] to-transparent). Never on buttons or cards. Never colorful or vibrant gradients.
-   **Blur**: None on elements. No backdrop-blur effects.

# Component Stylings

## Buttons
-   **Primary**: Solid Primary color background. White text. rounded-md. Height h-14 to h-16 for good touch targets. transition-all duration-200 hover:scale-105 (scale transformation for feedback). Color shift on hover (e.g., hover:bg-blue-600). No shadow.
-   **Secondary**: Solid Muted background (Gray 100). Dark text. hover:bg-gray-200 with scale effect.
-   **Outline**: border-4 solid color (not border-2 for more boldness). Text matches border color. Transparent bg. hover:bg-[color] hover:text-white (fill effect on hover).

## Cards
-   **Style**: "Color Block".
-   **Appearance**: Solid background color (White on Gray page, or soft color tints like bg-blue-50, bg-green-50 for features). No shadow. No border. Padding is generous (p-6 or p-8). Rounded corners rounded-lg.
-   **Interaction**: group cursor-pointer transition-all duration-200 hover:scale-[1.02] (subtle scale). For colored backgrounds, add hover:bg-[color]-100 for intensification. Icons within cards can have group-hover:scale-110.

## Inputs
-   **Normal**: Gray 100 background (bg-gray-100). No border. Text Gray 900. rounded-md.
-   **Focus**: White background. border-2 solid Primary. No focus ring glow, just the hard border.

## Section Stylings
-   **Alternating Backgrounds**: Use White vs. Gray 100 (#F3F4F6) vs. Bold accent colors (Primary Blue, Emerald, Amber) to distinguish page sections. Sharp color transitions between sections.
-   **Dividers**: No thin line dividers between sections. Use whitespace or color blocks. Exception: FAQ uses thick border-2 between items for structure.

# Iconography
-   **Library**: lucide-react.
-   **Style**: Standard to bold stroke (2px to 2.5px for emphasis).
-   **Treatment**: Often placed inside a solid colored circle (white circle with colored icon like bg-white text-blue-600). Circle size h-14 w-14 or h-16 w-16.
-   **Animation**: transition-transform duration-200 group-hover:scale-110 for icons within cards. Simple color intensity shifts on hover.

# Layout & Spacing
-   **Container**: max-w-7xl.
-   **Grid**: Rigid. 12-column base. Elements align perfectly.
-   **Spacing**: Comfortable but structured. Multiples of 4 (Tailwind default).
-   **Density**: Medium. Not too airy, not too dense. "Functional".

# Motion
-   **Vibe**: "Digital", "Snappy", "Direct".
-   **Transitions**: transition-all duration-200 for most interactions. duration-300 for larger transformations.
-   **Hover**: Immediate visual feedback through:
     - Scale transformations (hover:scale-105 for buttons, hover:scale-[1.02] for cards)
     - Color shifts (darkening or lightening)
     - Color fills (outline buttons filling with color)
     - Icon scaling within cards (group-hover:scale-110)

# Accessibility
-   **Focus Rings**: Since we have no shadows, focus states must use high-contrast ring-2 ring-offset-2 ring-blue-500 or similar solid outlines.
-   **Contrast**: Text on colored backgrounds must pass WCAG AA (e.g., White text on Blue 500 is okay, but check carefully with lighter accents).

# Non-Genericness / "The Bold Factor"
-   **Avoid**: "Material Design" floating cards, generic Bootstrap layouts, subtle pastels everywhere.
-   **Emphasize**: The "Poster" look. Treat every section like a flat graphic poster with bold color blocking.
-   **Bold Choices Implemented**:
     - **Vibrant full-section color blocks** (Blue hero, Emerald benefits, Amber CTA, Dark gray How It Works & Footer)
     - **Dramatic scale effects** on pricing cards (popular tier starts larger and scales more)
     - **Multi-color stat numbers** (each stat uses a different accent color)
     - **Abstract geometric compositions** (overlapping shapes in hero illustration and benefits section)
     - **Pronounced hover states** (scale, color intensification, fills)
     - **Bold typography** with tight leading and strong weight contrast
     - **Thick borders** (border-4 on outline buttons, border-2 on FAQ items)
-   **Visual Interest Without Depth**: Achieved through color contrast, geometric layering, and scale—never shadows or gradients.
</design-system>`,
	},
	{
		id: 'playful-geometric',
		name: '趣味几何',
		description: '一种充满活力、能量十足的美学风格，将稳定的结构网格与奇特的几何装饰相结合',
		fixedPromptId: 'byPrompt',
		prompt: `<design-system>
# Playful Geometric Design System

## Design Philosophy

**Playful Geometric** is the antidote to sterile, corporate minimalism. It creates an emotional connection through **optimism, clarity, and tactile fun**.

The core concept is **"Stable Grid, Wild Decoration"**. The content itself (text, forms) lives in clean, readable areas, but the world around it is alive with movement and shape. It references the **Memphis Group** (80s) but cleans it up for modern digital screens—removing the chaos while keeping the energy.

### The Vibe
**Friendly. Tactile. Pop. Energetic.**
It feels like a playground or a well-organized sticker book. It invites clicking. It smiles at you.

### Visual Signatures
- **Primitive Shapes**: Circles, triangles, squares, pill shapes, and squiggles used as background elements, masks, or icons.
- **Hard Shadows**: Elements often have a hard, offset drop shadow (no blur) giving a sticker or cut-out paper feel.
- **Pattern Fills**: Polka dots, grid lines, and diagonal stripes used to fill shapes or backgrounds.
- **Varied Radii**: Mixing fully rounded corners with sharp ones to create "leaf" shapes or asymmetric blobs.

---

## Design Token System

### Colors (Light Mode)
A punchy, high-saturation palette anchored by strong neutrals.


background:        #FFFDF5    // Warm Cream/Off-White (Paper feel)
foreground:        #1E293B    // Slate 800 (Softer than black)
muted:             #F1F5F9    // Slate 100
mutedForeground:   #64748B    // Slate 500
accent:            #8B5CF6    // Vivid Violet (Primary Brand)
accentForeground:  #FFFFFF    // White
secondary:         #F472B6    // Hot Pink (Playful pop)
tertiary:          #FBBF24    // Amber/Yellow (Optimism)
quaternary:        #34D399    // Emerald/Mint (Freshness)
border:            #E2E8F0    // Slate 200
input:             #FFFFFF    // White
card:              #FFFFFF    // White
ring:              #8B5CF6    // Violet Focus


**Usage Rule**: Use accent for primary actions. Use secondary, tertiary, and quaternary rotationally for decorative shapes, icons, or emphasized words to create a "confetti" effect.

### Typography

**Headings**: "Outfit", system-ui, sans-serif
- A geometric sans with character. Rounded corners on letters make it friendly.
- **Weights**: Bold (700) or ExtraBold (800).

**Body**: "Plus Jakarta Sans", system-ui, sans-serif
- Highly legible, modern, geometric but humanist.
- **Weights**: Regular (400), Medium (500).

**Scale Ratio**: 1.25 (Major Third) - melodic and harmonious.

### Radius & Border


radius-sm:   8px
radius-md:   16px
radius-lg:   24px
radius-full: 9999px
border-width: 2px     // Chunky borders by default


**Special "Blob" Radius**: rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none (Speech bubble style) or rounded-t-full rounded-b-none (Arch).

### Shadows & Effects

**The "Pop" Shadow (Hard Shadow)**:

box-shadow: 4px 4px 0px 0px #1E293B;  // Dark hard shadow
box-shadow-hover: 6px 6px 0px 0px #1E293B; // Lift effect
box-shadow-active: 2px 2px 0px 0px #1E293B; // Press effect

No blur. Solid offset colors.

### Textures & Patterns
- **Dot Grid**: A background of small dots (bg-[url(...)]) in strict formation.
- **Squiggles**: SVG paths used as section dividers or underlining for headings.
- **Confetti**: Small SVG shapes (triangles, circles) absolutely positioned behind main content blocks.

---

## Component Stylings

### Buttons

**Primary Button ("The Candy Button")**:

- Bg: accent (#8B5CF6)
- Text: white, font-weight: 700
- Radius: rounded-full (Pill)
- Border: 2px solid #1E293B (Dark border around color)
- Shadow: 4px 4px 0px #1E293B (Hard shadow)
- Hover: translate-x-[-2px] translate-y-[-2px], shadow extends to 6px 6px
- Active: translate-x-[2px] translate-y-[2px], shadow shrinks to 2px 2px
- Icon: ArrowRight, circular background (white) inside button


**Secondary Button**:

- Bg: transparent
- Text: foreground
- Border: 2px solid #1E293B
- Radius: rounded-full
- Shadow: none
- Hover: bg-tertiary (#FBBF24) - Fills with yellow on hover


### Cards

**The "Sticker" Card**:

- Bg: white
- Border: 2px solid #1E293B
- Radius: rounded-xl
- Shadow: 8px 8px 0px #E2E8F0 (Soft hard shadow) or #F472B6 (Pink shadow for featured)
- Hover: Rotate -1deg, Scale 1.02 (Wiggle effect)
- Title: Bold Outfit font
- Icon: Floating circle div with centered icon, sitting half-in/half-out of the top border.


### Inputs


- Bg: white
- Border: 2px solid #CBD5E1
- Radius: rounded-lg
- Text: foreground
- Shadow: 4px 4px 0px transparent (hidden initially)
- Focus: Border accent, Shadow 4px 4px 0px accent (Hard color shadow on focus)
- Label: Bold, uppercase, small tracking-wide.


---

## Layout Strategy

### General
- **Container**: max-w-6xl (Generous width).
- **Spacing**: py-24 (96px). Spacious but not empty; filled with patterns.
- **Grid**: 12-column logic, but grouped into big blocks (6/6 or 4/4/4).

### Unique Section Layouts
1.  **Hero**:
    - Text left, Image right.
    - **Decoration**: A massive yellow circle behind the text. A dotted pattern behind the image. The image itself has a "blob" mask (CSS clip-path or border-radius manipulation).
2.  **Features**:
    - Grid of 3.
    - **Decoration**: Each card is connected by a dashed SVG line drawn in the background.
    - Alternating colors for card headers (Violet, Pink, Yellow).
3.  **Pricing**:
    - The middle card is scaled up (1.1) and has a massive yellow star badge "MOST POPULAR" rotated 15deg.

---

## Effects & Animation

**Feel**: Bouncy, Elastic, Fun.

- **Hover**: transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] (Overshoot/Bounciness).
- **Entrance**: Elements shouldn't just fade in; they should **pop** in (Scale 0->1 with bounce).
- **Marquee**: Use infinite scrolling text for client logos or keywords.
- **Wiggle**: Keyframe animation rotate: 0deg -> 3deg -> -3deg -> 0deg on hover for icons.

---

## Iconography

**Lucide React** settings:
- **Stroke Width**: 2.5px (Bold/Chunky).
- **Style**: Round line caps, round line joins.
- **Color**: Often white inside a colored circle, or the dark foreground color.
- **Usage**: Enclosed in shapes. Never floating alone. A "Check" icon isn't just a check; it's a check inside a green circle.

---

## Responsive Strategy

- **Mobile**:
  - Stack everything.
  - Reduce "pop" shadows to 2px to save space.
  - Turn horizontal squiggle lines into vertical dividers.
  - Keep buttons big and tappable (min 48px height).
  - Hide complex background floating shapes that might overlap text.

---

## Accessibility & Best Practices

- **Contrast**: The text is slate-800 on off-white/white, which is AAA.
- **Color**: Never rely *only* on color. Use shapes and text labels.
- **Motion**: Respect prefers-reduced-motion. Disable the "bounce" and "wiggle" effects if preferred.
- **Focus**: The focus state is high-contrast (thick colored border + hard shadow).
</design-system>`,
	},
	{
		id: 'bauhaus',
		name: '包豪斯',
		description: '粗犷的几何现代主义风格',
		fixedPromptId: 'byPrompt',
		prompt: `<design-system>
# Design Style: Bauhaus

## 1. Design Philosophy
The Bauhaus style embodies the revolutionary principle "form follows function" while celebrating pure geometric beauty and primary color theory. This is **constructivist modernism**—every element is deliberately composed from circles, squares, and triangles. The aesthetic should evoke 1920s Bauhaus posters: bold, asymmetric, architectural, and unapologetically graphic.

**Vibe**: Constructivist, Geometric, Modernist, Artistic-yet-Functional, Bold, Architectural

**Core Concept**: The interface is not merely a layout—it is a **geometric composition**. Every section is constructed rather than designed. Think of the page as a Bauhaus poster brought to life: shapes overlap, borders are thick and deliberate, colors are pure primaries (Red #D02020, Blue #1040C0, Yellow #F0C020), and everything is grounded by stark black (#121212) and clean white.

**Key Characteristics**:
- **Geometric Purity**: All decorative elements derive from circles, squares, and triangles
- **Hard Shadows**: 4px and 8px offset shadows (never soft/blurred) create depth through layering
- **Color Blocking**: Entire sections use solid primary colors as backgrounds
- **Thick Borders**: 2px and 4px black borders define every major element
- **Asymmetric Balance**: Grids are used but intentionally broken with overlapping elements
- **Constructivist Typography**: Massive uppercase headlines (text-6xl to text-8xl) with tight tracking
- **Functional Honesty**: No gradients, no subtle effects—everything is direct and declarative

## 2. Design Token System (The DNA)

### Colors (Single Palette - Light Mode)
The palette is strictly limited to the Bauhaus primaries, plus stark black and white.
-   background: #F0F0F0 (Off-white canvas)
-   foreground: #121212 (Stark Black)
-   primary-red: #D02020 (Bauhaus Red)
-   primary-blue: #1040C0 (Bauhaus Blue)
-   primary-yellow: #F0C020 (Bauhaus Yellow)
-   border: #121212 (Thick, distinct borders)
-   muted: #E0E0E0

### Typography
-   **Font Family**: **'Outfit'** (geometric sans-serif from Google Fonts). This typeface's circular letterforms and clean geometry perfectly embody Bauhaus principles.
-   **Font Import**: Outfit:wght@400;500;700;900
-   **Scaling**: Extreme contrast between display and body text
    -   Display: text-4xl (mobile) → text-6xl (tablet) → text-8xl (desktop)
    -   Subheadings: text-2xl → text-3xl → text-4xl
    -   Body: text-base → text-lg
-   **Weights**:
    -   Headlines: font-black (900) with uppercase and tracking-tighter
    -   Subheadings: font-bold (700) with uppercase
    -   Body: font-medium (500) for readability
    -   Labels: font-bold (700) with uppercase and tracking-widest
-   **Line Height**: Tight for headlines (leading-[0.9]), relaxed for body (leading-relaxed)

### Radius & Border
-   **Radius**: Binary extremes—either rounded-none (0px) for squares/rectangles or rounded-full (9999px) for circles. No in-between rounded corners.
-   **Border Widths**:
    -   Mobile: border-2 (2px)
    -   Desktop: border-4 (4px)
    -   Navigation/Major divisions: border-b-4 (4px bottom border)
-   **Border Color**: Always #121212 (black) for maximum contrast

### Shadows/Effects
-   **Hard Offset Shadows** (inspired by Bauhaus layering):
    -   Small: shadow-[3px_3px_0px_0px_black] or shadow-[4px_4px_0px_0px_black]
    -   Medium: shadow-[6px_6px_0px_0px_black]
    -   Large: shadow-[8px_8px_0px_0px_black]
-   **Button Press Effect**: active:translate-x-[2px] active:translate-y-[2px] active:shadow-none (simulates physical button press)
-   **Card Hover**: hover:-translate-y-1 or hover:-translate-y-2 (subtle lift)
-   **Patterns**: Use CSS background patterns for texture
    -   Dot grid: radial-gradient(#fff 2px, transparent 2px) with background-size: 20px 20px
    -   Opacity overlays: Large geometric shapes at 10-20% opacity for background decoration

## 3. Component Stylings

### Buttons
-   **Variants**:
    -   **Primary** (Red): bg-[#D02020] text-white border-2 border-black shadow-[4px_4px_0px_0px_black]
    -   **Secondary** (Blue): bg-[#1040C0] text-white border-2 border-black shadow-[4px_4px_0px_0px_black]
    -   **Yellow**: bg-[#F0C020] text-black border-2 border-black shadow-[4px_4px_0px_0px_black]
    -   **Outline**: bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_black]
    -   **Ghost**: border-none text-black hover:bg-gray-200
-   **Shapes**: Either rounded-none (square) or rounded-full (pill). Use shape variants deliberately.
-   **States**:
    -   Hover: Slight opacity change (hover:bg-[color]/90)
    -   Active: Button "presses down" (active:translate-x-[2px] active:translate-y-[2px] active:shadow-none)
    -   Focus: 2px offset ring
-   **Typography**: Uppercase, font-bold, tracking-wider

### Cards
-   **Base Style**: White background, border-4 border-black, shadow-[8px_8px_0px_0px_black]
-   **Hover**: hover:-translate-y-1 (subtle lift effect)
-   **Content Hierarchy**: Large bold titles, medium body text, generous padding

### Accordion (FAQ)
-   **Closed State**: White background, border-4 border-black, shadow-[4px_4px_0px_0px_black]
-   **Open State**: Red background (bg-[#D02020]), white text for header
-   **Expanded Content**: Light yellow background (bg-[#FFF9C4]), black text, border-t-4 border-black
-   **Icon**: ChevronDown with rotate-180 when open

## 4. Layout & Spacing
-   **Container Width**: max-w-7xl for main content sections (creates poster-like breadth)
-   **Section Padding**:
    -   Mobile: py-12 px-4
    -   Tablet: py-16 px-6
    -   Desktop: py-24 px-8
-   **Grid Systems**:
    -   Stats: 1-column (mobile) → 2-column (tablet) → 4-column (desktop) with divide-y and divide-x borders
    -   Features: 1-column → 2-column → 3-column with 8px gaps
    -   Pricing: 1-column → 3-column (center elevated on desktop)
-   **Spacing Scale**: Consistent use of 4px, 8px, 12px, 16px, 24px
-   **Section Dividers**: Every section has border-b-4 border-black creating strong horizontal rhythm

## 5. Non-Genericness (Bold Choices)

**This design MUST NOT look like generic Tailwind or Bootstrap. The following are mandatory:**

-   **Color Blocking**: Entire sections use solid primary colors as backgrounds:
    -   Hero right panel: Blue (bg-[#1040C0])
    -   Stats section: Yellow (bg-[#F0C020])
    -   Blog section: Blue (bg-[#1040C0])
    -   Benefits section: Red (bg-[#D02020])
    -   Final CTA: Yellow (bg-[#F0C020])
    -   Footer: Near-black (bg-[#121212])

-   **Rotated Elements**: Deliberate 45° rotation on:
    -   Every 3rd shape in repeating patterns
    -   Step numbers in "How It Works" (counter-rotate inner content)
    -   Decorative background shapes

-   **Image Treatments**:
    -   Blog images: Alternate between rounded-full and rounded-none, grayscale filter with hover:grayscale-0
    -   Testimonial avatars: Circular crop with rounded-full and grayscale filter

-   **Unique Decorations**: Small geometric shapes (8px-16px) as corner decorations on cards, using the three primary colors in rotation

## 6. Imagery
-   **Image Treatment**: All images use grayscale filter by default, color on hover

## 7. Responsive Strategy
-   **Mobile-First Approach**: Start with single-column layouts, expand to grids on larger screens
-   **Breakpoints**:
    -   Mobile: < 640px (sm)
    -   Tablet: 640px - 1024px (sm to lg)
    -   Desktop: > 1024px (lg+)
-   **Typography Scaling**: All text uses responsive classes (text-4xl sm:text-6xl lg:text-8xl)
-   **Border/Shadow Scaling**: Reduce border and shadow sizes on mobile (border-2 → border-4, shadow-[3px] → shadow-[8px])
-   **Navigation**: Hamburger menu button on mobile (< 768px), full nav on desktop
-   **Grid Adaptations**:
    -   Stats: 1 col → 2 col (sm) → 4 col (lg)
    -   Features: 1 col → 2 col (md) → 3 col (lg)
    -   How It Works: 1 col → 2 col (sm) → 4 col (md), hide connecting line on mobile

## 8. Animation & Micro-Interactions
-   **Feel**: Mechanical, snappy, geometric (no soft organic movement)
-   **Transition Duration**: duration-200 or duration-300 (fast and decisive)
-   **Easing**: ease-out (mechanical feel)
-   **Interactions**:
    -   Button press: Translate and remove shadow (active:translate-x-[2px] active:translate-y-[2px] active:shadow-none)
    -   Card hover: Lift upward (hover:-translate-y-1 or hover:-translate-y-2)
    -   Accordion: ChevronDown rotation (rotate-180) and content reveal with max-height transition
    -   Icon hover: Scale up on grouped shapes (group-hover:scale-110)
    -   Link hover: Color change to accent color
-   **Background Patterns**: Static (no animation on patterns)
</design-system>

# 待排版的文字
	`,
	},
	{
		id: 'Neo-brutalism',
		name: '新粗野主义',
		description: '一种原始、高对比度的美学风格，模仿印刷设计和DIY朋克文化',
		fixedPromptId: 'byPrompt',
		prompt: `<design-system>
# Design Style: Neo-brutalism

## Design Philosophy

**Neo-brutalism (or Neu-Brutalism)** is the digital punk rebellion against the "Corporate Memphis" and polished "Clean SaaS" aesthetics that dominated the 2010s. While traditional Brutalism (architecture/early web) was utilitarian and drab, **Neo-brutalism** is vibrant, performative, and intentionally distinct. It combines the raw, unrefined structural honesty of brutalism with the high-saturation energy of Pop Art, the "sticker" culture of the early internet, and the rebellious spirit of DIY zine design.

**Core DNA & Fundamental Principles:**

1.  **Unapologetic Visibility (The Anti-Subtle)**: Modern design often tries to be invisible—borderless cards floating on gradients, soft shadows that barely exist, blur effects that obscure structure. Neo-brutalism rejects this entirely. It demands to be seen. Structure is not implied; it is **enforced with thick, hard-edged black lines** (border-4 everywhere). Shadows are not simulated light diffusion; they are **solid blocks of ink** offset at 45-degree angles (8px, 12px, 16px offsets with zero blur). Every element has **visual weight and presence**.

2.  **Digital Tactility (The Sticker Effect)**: The screen is treated not as a fluid glass surface, but as a **collage board or bulletin board**. Elements feel like physical stickers, paper cutouts, or printed cards layered on top of each other. They have "physicality"—buttons **press down mechanically** (translate X and Y to cover their shadow), cards **lift up physically** (translate up while shadow grows), and text blocks are **rotated like stickers slapped on at angles** (rotate-1, -rotate-2). This creates a tangible, almost sculptural interface.

3.  **Organized Chaos (Controlled Messiness)**: The design embraces a "planned messiness" that looks spontaneous but is carefully orchestrated. We use **slight rotations** (-rotate-2, rotate-1, rotate-3) on containers and text to break the monotony of the grid. Elements **overlap intentionally** (floating decorative shapes, badges positioned absolutely). **Asymmetry is encouraged**—headlines split across lines with different colors and rotations, layouts favor 60/40 splits over perfect 50/50. Yet the underlying structure remains **rigid and functional** to ensure usability. It is "ugly-cool"—ugly by traditional polished standards, cool by rebellious intention.

4.  **Default & Raw (Web 1.0 Homage)**: The aesthetic celebrates the "default" look of the web before CSS3 smoothed everything out. It uses **pure black** (#000000) for all borders and text—no subtle grays. It uses **high-saturation primary colors** (Hot Red #FF6B6B, Vivid Yellow #FFD93D, Soft Violet #C4B5FD) that feel like unmixed paint or highlighter markers. Typography is **bold and heavy** (font weights 700 and 900 only). The **cream background** (#FFFDF5) mimics aged paper or newsprint, rejecting stark white.

5.  **Maximalism as Statement**: While modern design trends toward minimalism, neo-brutalism is **deliberately maximal**. More borders. More shadows. More uppercase text. More visual noise (halftone patterns, grid overlays, noise textures). This isn't visual clutter—it's **visual density** used to create energy and urgency.

6.  **Irony & Confidence**: The style exudes a sense of irony and self-awareness. It says, "I know this looks unpolished, and that's exactly why it's good." It requires **confidence** to pull off; there is no room for timidity in Neo-brutalism. It's anti-corporate, anti-smooth, anti-boring.

7.  **Mechanical Interactivity**: Interactions feel **mechanical and satisfying**, not smooth and ethereal. Buttons don't fade or glow—they **click down** like physical switches. Hovers don't soften—they **snap** into place. Transitions are **fast** (duration-100, duration-200) and **direct**, creating a snappy, arcade-game-like responsiveness.

**The Vibe & Emotional Tone**:
*   **Nostalgic & Retro-Modern**: Channelling Y2K energy, 90s punk zines, DIY flyers, rave posters, and early web forums.
*   **Energetic & Loud**: It **screams** rather than whispers. It grabs attention aggressively.
*   **Playful yet Functional**: It uses **gamified interactions** (bouncy hovers, hard clicks, rotating badges) to make utilitarian software feel like a toy or game.
*   **Anti-Corporate Authenticity**: It rejects the polished veneer of corporate design systems, embracing rawness and imperfection as honesty.
*   **Confident & Bold**: Every design choice is **deliberate and exaggerated**. Nothing is subtle.

**Visual Signatures (What Makes It Instantly Recognizable)**:
*   **Hard Black Strokes**: The unifying visual element. **If it doesn't have a border, it doesn't exist.** border-4 is the default. All borders are solid black.
*   **Offset Hard Shadows**: Shadows are **solid rectangles** with zero blur, offset at 45-degree angles (bottom-right). Small: 4px 4px 0px 0px #000. Medium: 8px 8px 0px 0px #000. Large: 12px 12px 0px 0px #000. Massive: 16px 16px 0px 0px #000.
*   **The "Pop" Palette**: Cream background (#FFFDF5) serves as a neutral canvas for **intense bursts of highlighter colors** (Red, Yellow, Violet). Black is the structural color. White is used for contrast panels.
*   **Typography as Texture**: Massive, heavy fonts (**Space Grotesk at 900 weight**) often treated with text outlines (-webkit-text-stroke: 2px black with transparent fill) or highlighted by placing text inside bordered, colored boxes. **All caps** for emphasis. Extreme tracking (tracking-tighter for headlines, tracking-widest for labels).
*   **Sticker Layering**: Text blocks, badges, and containers are **rotated and layered** like stickers on a laptop. Elements cast hard shadows onto elements "below" them.
*   **Texture & Patterns**: Backgrounds aren't flat. Use **halftone dots** (radial gradients), **grid patterns** (linear gradient lines), **noise textures** (SVG filters), and **geometric overlays** to add visual richness without traditional depth.
*   **Asymmetric Composition**: Deliberately **break the grid**. Headlines split unevenly. Sections use 60/40 or 70/30 splits. Elements float off-axis.

**What Neo-Brutalism Is NOT**:
*   **Not Minimal**: It's maximal and dense.
*   **Not Smooth**: It's jagged, sharp, and angular.
*   **Not Subtle**: It's loud, high-contrast, and in-your-face.
*   **Not Polished**: It celebrates roughness and rawness.
*   **Not Corporate**: It's rebellious and anti-establishment in its aesthetic DNA.

## Design Token System (The DNA)

### Colors (High Saturation Light Mode Palette)
Neo-brutalism uses a **single, definitive light mode palette**. All colors are high-saturation and unapologetic.

*   **Background (Canvas)**: #FFFDF5 (Cream/Off-White)
    *   A warm, paper-like background that mimics aged newsprint or recycled paper. Softer than stark white, more authentic.
    *   Use: Main page background, card interiors, contrast panels.

*   **Foreground (Ink)**: #000000 (Pure Black)
    *   The structural color. Used for ALL text, ALL borders, ALL shadows. No grays, no variations.
    *   Use: Text, borders (border-black), shadows, icons.

*   **Accent (Hot Red)**: #FF6B6B
    *   Primary action color. Vibrant, energetic, attention-grabbing.
    *   Use: Primary buttons (bg-neo-accent), hover states, important badges, call-to-action backgrounds.

*   **Secondary (Vivid Yellow)**: #FFD93D
    *   Secondary highlight color. Bright, cheerful, high-energy.
    *   Use: Secondary buttons, badges, logo backgrounds, footer background, alternate section backgrounds.

*   **Muted (Soft Violet)**: #C4B5FD
    *   Tertiary color for depth and variation without clashing.
    *   Use: Subtle backgrounds (bg-neo-muted), card headers, FAQ answer backgrounds, decorative elements.

*   **White**: #FFFFFF
    *   Used for high-contrast text on dark backgrounds (e.g., black sections, accent buttons).
    *   Use: Text on black backgrounds, inverted buttons, contrast panels.

**Color Usage Rules:**
- **Never use subtle grays.** It's black or a color, never #333 or #666.
- **High contrast is mandatory.** All text must pass WCAG AA on its background.
- **Color blocking:** Sections alternate between cream, secondary, muted, and black to create visual rhythm.

### Typography
*   **Family**: Space Grotesk (Google Font: font-family: 'Space Grotesk', sans-serif)
    *   A geometric sans-serif with quirky personality. Modern but not clinical. Bold enough to carry heavy weights.
    *   Load via Google Fonts: https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&display=block

*   **Weights**: **Only heavy weights allowed.**
    *   **Black (900)**: For all headings (h1, h2, h3). font-black
    *   **Bold (700)**: For all body text, labels, buttons. font-bold
    *   **Medium (500)**: Sparingly, only for subtle emphasis. font-medium
    *   **Regular (400)**: Generally avoided. Lightness is forbidden in neo-brutalism.

*   **Scale**:
    *   Display: text-8xl to text-9xl (96px to 128px) for hero headlines.
    *   Heading 2: text-6xl to text-8xl (60px to 96px) for section titles.
    *   Heading 3: text-4xl to text-5xl (36px to 48px) for subsections.
    *   Body Large: text-2xl to text-3xl (24px to 30px) for emphasis.
    *   Body: text-lg to text-xl (18px to 20px) for readable text.
    *   Small: text-sm to text-base (14px to 16px) for labels and metadata.

*   **Styling Techniques**:
    *   **Text Stroke (Display)**: Use -webkit-text-stroke: 2px black with color: transparent for massive hollow outlined text.
    *   **Case**: Heavy use of **UPPERCASE** (uppercase) for headings, labels, buttons, and emphasis. Lowercase is acceptable for body text.
    *   **Tracking**:
        *   Headlines: tracking-tighter or tracking-tight for density.
        *   Labels: tracking-widest or tracking-[0.2em] for emphasis.
    *   **Line Height**: Tight leading. leading-none or leading-[0.85] for display. leading-snug or leading-relaxed for body.

### Radius & Borders
*   **Radius**: **Default is 0px (sharp, angular corners).**
    *   Exception: rounded-full ONLY for pill badges, circular stickers, or decorative shape elements.
    *   Never use rounded-md or rounded-lg. It's either sharp or fully round.

*   **Borders**: **Mandatory on every visual element.**
    *   Default: border-4 (4px solid black). This is the signature thickness.
    *   Thin: border-2 (2px) only for subtle separators or ghost buttons.
    *   Thick: border-8 (8px) for major section dividers or hero elements.
    *   All borders: border-black (solid black, no transparency).

### Shadows & Effects
*   **Hard Shadows (The Signature)**: Offset, solid black shadows with **zero blur** and **zero spread**. Always bottom-right direction.
    *   **Small**: shadow-[4px_4px_0px_0px_#000] or box-shadow: 4px 4px 0px 0px #000
    *   **Medium**: shadow-[8px_8px_0px_0px_#000] or box-shadow: 8px 8px 0px 0px #000
    *   **Large**: shadow-[12px_12px_0px_0px_#000] or box-shadow: 12px 12px 0px 0px #000
    *   **Massive**: shadow-[16px_16px_0px_0px_#000] or shadow-[20px_20px_0px_0px_#fff] (for elements on black backgrounds)

*   **Text Shadows**: Use for text on colored backgrounds.
    *   text-shadow: 4px 4px 0px #000 or text-shadow: 6px 6px 0px #000

*   **Background Patterns & Textures** (Critical for depth):
    *   **Halftone Dots**:
        css
        background-image: radial-gradient(#000 1.5px, transparent 1.5px);
        background-size: 20px 20px;
        
    *   **Grid Pattern** (graph paper):
        css
        background-size: 40px 40px;
        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        
    *   **Noise Texture** (SVG filter):
        css
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'%2F%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        
    *   **Radial Dots** (for backgrounds):
        css
        background-image: radial-gradient(circle, #000 2px, transparent 2.5px);
        background-size: 30px 30px;
        

## Component Styling Principles

### Buttons
*   **Shape**: Rectangular with sharp corners. Default height: h-12 to h-14. No rounding.
*   **Style**:
    *   Primary: bg-neo-accent (red) with border-4 border-black.
    *   Secondary: bg-neo-secondary (yellow) with border-4 border-black.
    *   Outline: bg-white with border-4 border-black.
    *   Ghost: border-2 border-transparent that becomes border-black on hover.
*   **Typography**: font-bold text-sm uppercase tracking-wide (all caps, bold, spaced).
*   **Shadow**: Hard shadow shadow-[4px_4px_0px_0px_#000] or shadow-[6px_6px_0px_0px_#000].
*   **Interaction (Critical)**: **"Push" effect.** On :active, translate the button to cover its shadow:
    css
    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
    
    This creates a mechanical "click down" feel, like a physical button.
*   **Hover**: Slight background darkening or shadow intensification. Fast transition (duration-100).

### Cards / Containers
*   **Structure**: bg-white with border-4 border-black and sharp corners (rounded-none).
*   **Shadow**: Deep hard shadows (shadow-[8px_8px_0px_0px_#000] to shadow-[12px_12px_0px_0px_#000]).
*   **Hover (Lift Effect)**: Translate card **upward** and **increase shadow size**:
    css
    hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000]
    
    or
    css
    hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#000]
    
    This makes the card feel like it's physically lifting off the page.
*   **Headers**: Often have colored backgrounds (bg-neo-muted/20 or bg-neo-secondary) with border-b-4 border-black separator.

### Inputs
*   **Style**: Thick black borders (border-4 border-black). Sharp corners. bg-white default.
*   **Typography**: Large, bold text (font-bold text-lg or text-xl). Placeholder is placeholder:text-black/40.
*   **Focus**: **Background color change** instead of ring:
    css
    focus-visible:bg-neo-secondary focus-visible:shadow-[4px_4px_0px_0px_#000] focus-visible:outline-none focus-visible:ring-0
    
    Input becomes yellow and gains a shadow when focused. No soft glow.
*   **Height**: h-14 to h-20 for touch-friendly sizing.

### Navigation
*   **Logo**: Bordered box (border-4 border-black) with accent background. Uppercase, black font.
*   **Links**: Bold, uppercase text. Hover state adds border and background:
    css
    hover:border-black hover:bg-neo-accent hover:px-2 hover:shadow-[4px_4px_0px_0px_#000]
    
*   **Mobile Menu**: Hamburger button as bordered square with shadow. Menu slides in with stacked bordered buttons.

### Badges
*   **Shape**: Pill (rounded-full) or square (border-4).
*   **Style**: Colored background (bg-neo-accent or bg-neo-secondary) with thick border and shadow.
*   **Typography**: font-black text-sm uppercase tracking-widest.
*   **Usage**: Positioned absolutely over elements (:absolute top-4 left-4), rotated (rotate-3), or inline.

## Layout Principles

*   **Container Width**: Use container mx-auto with max-w-7xl or max-w-6xl for focused content width.
*   **Spacing**: Dense 8px base grid. Sections have py-16 to py-32 vertical padding. Content spacing: gap-8 to gap-12.
*   **Rotation (Sticker Effect)**: Use slight rotations on containers and text blocks to break grid monotony:
    *   rotate-1 (1 degree), -rotate-2 (-2 degrees), rotate-3 (3 degrees).
    *   Apply to headline spans, cards, badges, and CTAs.
*   **Marquee**: Use horizontal scrolling marquees (e.g., react-fast-marquee) as:
    *   Trust indicators at page top.
    *   Testimonial carousels.
    *   Section dividers with repeated text.
*   **Overlapping**: Allow elements to overlap using absolute positioning:
    *   Floating decorative shapes (absolute top-20 left-0).
    *   Badges positioned on corners of cards (-top-6 -right-6).
    *   Background text as texture (absolute opacity-10 text-9xl).
*   **Visual Chaos Zones**: Intentionally create "busy" areas (like Hero right side) with:
    *   Stacked geometric shapes.
    *   Multiple rotated badges.
    *   Large background numbers or text.
*   **Asymmetry**: Avoid perfect symmetry. Use 60/40 splits, offset columns, and staggered grids.

## The "Bold Factor" (Non-Genericness)

These techniques ensure the design is unmistakably neo-brutalist and never generic:

1.  **Text Stroke for Display Typography**: Use -webkit-text-stroke: 2px black with color: transparent for massive hollow outlined headings. Overlay with solid version for depth effect.

2.  **Sticker Layering**: Elements feel like physical stickers:
    *   Rotated text blocks with borders and shadows.
    *   Absolutely positioned badges that overlap content.
    *   Multiple "layers" created with shadows.

3.  **Interactive Physics**: Elements must physically move:
    *   Buttons: **Push down** on click (active:translate-x-[2px] active:translate-y-[2px]).
    *   Cards: **Lift up** on hover (hover:-translate-y-2).
    *   Badges: **Rotate further** on hover (hover:rotate-12).

4.  **Primitive Shape Motifs**: Heavy use of:
    *   **Stars** (5-point, <Star /> from lucide-react). Use as decorative elements, ratings, and dividers.
    *   **Arrows** (<ArrowRight />) for directional cues.
    *   **Basic Shapes**: Squares, circles, rectangles as decorative floaters.

5.  **Thick Border Everywhere**: If an element doesn't have a visible border, it feels wrong. Even whitespace is bordered.

6.  **Color Blocking**: Large sections with solid color backgrounds (red, yellow, violet, black) to create high-contrast rhythm.

7.  **Texture Overlays**: Never leave backgrounds flat. Always add halftone, grid, or noise.

## Anti-Patterns (What to Avoid)

These techniques would break the neo-brutalist aesthetic:

*   **Blur Effects**: No blur(), no backdrop-blur, no soft box-shadow with blur radius. All shadows must be hard.
*   **Opacity/Transparency**: Avoid alpha transparency on backgrounds (except for texture overlays at low opacity).
*   **Smooth Gradients**: No bg-gradient-to-r fades. Use hard color stops or patterns instead.
*   **Rounded Corners (Mid-Range)**: Avoid rounded-md, rounded-lg, rounded-xl. It's either rounded-none (sharp) or rounded-full (pill/circle).
*   **Subtle Grays**: No #333, #666, #999. Use pure black or a color.
*   **Soft Animations**: No ease-in-out or slow durations. Use ease-linear or ease-out with fast durations.
*   **Minimalist Whitespace**: Don't leave large empty areas. Fill with texture, patterns, or decorative elements.

## Animation & Motion

*   **Feel**: Bouncy, playful, mechanical, arcade-like.
*   **Transition Speed**: Fast and snappy.
    *   Buttons: duration-100 (100ms).
    *   Cards/Hovers: duration-200 or duration-300 (200-300ms).
*   **Easing**: ease-linear for mechanical feel, ease-out for natural deceleration. Avoid ease-in-out.
*   **Hover Interactions**:
    *   Buttons: Background darken, then press on click.
    *   Cards: Translate upward (-translate-y-2) and shadow deepens.
    *   Links: Add border and background, snap into place.
*   **Looping Animations**:
    *   Slow spins on decorative stars (animate-spin-slow, custom duration 10s).
    *   Pulsing on call-to-action elements (animate-pulse).
    *   Bouncing on attention-grabbing badges (animate-bounce).
*   **Custom Animations** (via CSS):
    css
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 10s linear infinite;
    }
    

## Spacing, Layout & Iconography

*   **Max-Width**: max-w-7xl or max-w-6xl for main content. Sections can be full-width with contained inner content.
*   **Grid System**: Use Tailwind's grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) with responsive breakpoints.
*   **Spacing Scale**: Dense. gap-6 to gap-12 between elements. py-16 to py-32 for section padding.
*   **Iconography**: Import from lucide-react.
    *   Style: stroke-[3px] or stroke-[4px] for thick, bold strokes.
    *   Size: h-8 w-8 or larger (h-12 w-12) for emphasis.
    *   Placement: Inside bordered boxes (border-4 border-black bg-neo-accent p-4).
    *   Fill: Use fill-black or fill-white for solid icons.

## Responsive Strategy

*   **Mobile First**: Design starts with mobile (base) and scales up.
*   **Breakpoints**:
    *   sm: (640px) - Small tablets
    *   md: (768px) - Tablets
    *   lg: (1024px) - Desktops
    *   xl: (1280px) - Large desktops
*   **Mobile Adaptations**:
    *   **Typography**: Scale down (e.g., text-4xl sm:text-6xl md:text-8xl).
    *   **Spacing**: Reduce padding (e.g., p-8 sm:p-12 md:p-16).
    *   **Grids**: Stack to single column (grid-cols-1 md:grid-cols-2 lg:grid-cols-3).
    *   **Shadows**: Reduce size on mobile (e.g., shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000]).
    *   **Navigation**: Hamburger menu with bordered button. Full-screen or slide-in drawer.
    *   **Buttons**: Full width on mobile (w-full sm:w-auto).
    *   **Touch Targets**: Minimum h-14 for tappable elements.
*   **Core Aesthetic Maintained**: Even on mobile, keep thick borders, hard shadows, and bold typography. Don't default to "generic mobile" design.

## Accessibility & Best Practices

*   **Contrast**: High contrast is built-in (black on cream, white on black, black on yellow). Ensure all color combinations pass WCAG AA (4.5:1 for normal text, 3:1 for large text).
*   **Focus States**: Use thick focus rings:
    css
    focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
    
    or background color change (yellow) for inputs.
*   **Motion**: Respect prefers-reduced-motion:
    css
    @media (prefers-reduced-motion: reduce) {
      .animate-spin-slow, .animate-bounce, .animate-pulse {
        animation: none;
      }
    }
    
*   **Keyboard Navigation**: Ensure all interactive elements are keyboard-accessible. Tab order should be logical.
*   **Screen Readers**: Use semantic HTML (<button>, <nav>, <header>, <main>). Add aria-label to icon-only buttons.
*   **Touch Targets**: Minimum 44x44px (roughly h-12 or h-14 in Tailwind) for all tappable elements on mobile.
</design-system>
	
# 待排版的文字
`,
	},
	{
		id: 'sketch',
		name: '草图',
		description: '每个元素都像是用马克笔和铅笔在纹理纸上绘制而成',
		fixedPromptId: 'byPrompt',
		prompt: `<design-system>
# Design Philosophy

The Hand-Drawn design style celebrates authentic imperfection and human touch in a digital world. It rejects the clinical precision of modern UI design in favor of organic, playful irregularity that evokes sketches on paper, sticky notes on a wall, and napkin diagrams from a brainstorming session.

**Core Principles:**
- **No Straight Lines**: Every border, shape, and container uses irregular border-radius values to create wobbly, hand-drawn edges that reject geometric perfection
- **Authentic Texture**: The design layer paper grain, dot patterns, and subtle background textures to simulate physical media (notebook paper, post-its, sketch pads)
- **Playful Rotation**: Elements are deliberately tilted using small rotation transforms (-2deg to 2deg) to break rigid grid alignment and create casual energy
- **Hard Offset Shadows**: Reject soft blur shadows entirely. Use solid, offset box-shadows (4px 4px 0px) to create a cut-paper, layered collage aesthetic
- **Handwritten Typography**: Use exclusively handwritten or marker-style fonts (Kalam, Patrick Hand) that feel human and approachable, never corporate or sterile
- **Scribbled Decoration**: Add visual flourishes like dashed lines, hand-drawn arrows, tape effects, thumbtacks, and irregular shapes to reinforce the sketched aesthetic
- **Limited Color Palette**: Stick to pencil blacks, paper whites, correction marker red, and post-it yellow for bold but cohesive simplicity
- **Intentional Messiness**: Embrace overlap, asymmetry, and visual "mistakes" that make the design feel spontaneous and creative rather than manufactured

**Emotional Intent:**
This style should feel approachable, creative, human-centered, and fun. It lowers barriers and invites interaction by appearing unfinished and work-in-progress, making users feel like collaborators rather than consumers. Perfect for creative tools, brainstorming platforms, educational content, or any product that wants to emphasize human creativity over corporate polish.

# Design Token System

## Colors (Single Palette - Light Mode)
- **Background**: #fdfbf7 (Warm Paper)
- **Foreground**: #2d2d2d (Soft Pencil Black - never pure black)
- **Muted**: #e5e0d8 (Old Paper / Erased Pencil)
- **Accent**: #ff4d4d (Red Correction Marker)
- **Border**: #2d2d2d (Pencil Lead)
- **Secondary Accent**: #2d5da1 (Blue Ballpoint Pen)

## Typography
- **Headings**: Kalam (wght 700) - Looks like a thick felt-tip marker.
- **Body**: Patrick Hand (wght 400) - Legible but distinctly handwritten.
- **Scale**: Large and readable. Headings should vary in size dramatically to look like emphasized notes.

## Radius & Border
- **Wobbly Borders**: CRITICAL. Do NOT use standard rounded-* classes alone.
- **Technique**: Use inline style={{ borderRadius: ... }} with multiple values to create irregular organic ellipses.
  - Example: border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  - Store reusable radius values in config as wobbly and wobblyMd
- **Border Width**: Thick and variable. border-2 is the minimum. Use border-[3px] or border-4 for emphasis.
- **Style**: border-solid is default for most elements. Use border-dashed for secondary elements, dividers, and sketchy overlays.

## Shadows/Effects
- **Hard Offset Shadows**: No blur. Just a solid offset to create a cut-paper, layered collage aesthetic.
  - Standard: box-shadow: 4px 4px 0px 0px #2d2d2d;
  - Emphasized: box-shadow: 8px 8px 0px 0px #2d2d2d;
  - Hover State: Reduce offset 2px 2px or 6px 6px to create "lifting" effect
- **Paper Texture**: Use radial-gradient dot pattern on body background to simulate notebook paper grain
  - backgroundImage: radial-gradient(#e5e0d8 1px, transparent 1px)
  - backgroundSize: 24px 24px
- **Subtle Animations**: Gentle bounce (3s duration) for decorative elements, rotation on hover for playful interaction

# Component Stylings

## Buttons
- **Shape**: Irregular wobbly oval using custom border-radius from config
- **Normal State**:
  - White background, border-[3px] black border, black text
  - Hard offset shadow: shadow-[4px_4px_0px_0px_#2d2d2d]
  - Font: Patrick Hand (body font)
- **Hover State**:
  - Background fills with Accent red #ff4d4d, text turns white
  - Shadow reduces to shadow-[2px_2px_0px_0px_#2d2d2d]
  - Subtle translate: translate-x-[2px] translate-y-[2px]
- **Active State**:
  - Shadow disappears completely (button "presses flat")
  - Translate increases: translate-x-[4px] translate-y-[4px]
- **Secondary Variant**: Uses muted background #e5e0d8, hovers to blue #2d5da1

## Cards/Containers
- **Base Style**: White background (#ffffff) with wobbly black border (border-2)
- **Border Radius**: Use wobblyMd radius from config for medium containers
- **Shadow**: Subtle 3px 3px 0px 0px rgba(45, 45, 45, 0.1) for depth
- **Decoration Options**:
  - decoration="tape": Translucent gray bar positioned at top center with slight rotation
  - decoration="tack": Red circular thumbtack at top center
  - No decoration for minimal aesthetic
- **Special Treatments**:
  - Post-it yellow background #fff9c4 for feature cards
  - Speech bubble style for testimonials with geometric tail using border-based triangle
  - Sticky-note tags for section labels

## Inputs
- **Style**: Full box with wobbly borders (not just underline)
- **Border**: border-2 with wobbly radius matching button aesthetic
- **Font**: Patrick Hand (body font) for authentic hand-written feel
- **Background**: White with placeholder text in muted color #2d2d2d/40
- **Focus State**:
  - Border changes to blue #2d5da1
  - Ring effect: ring-2 ring-[#2d5da1]/20
  - No standard outline, maintains wobbly aesthetic

# Layout Strategy
- **Grid System**: Use Tailwind's responsive grid (md:grid-cols-2, md:grid-cols-3) but add visual irregularity
- **Rotation**: Apply small rotations (rotate-1, -rotate-2) to cards, images, and decorative elements
- **Breaking Alignment**:
  - Stats: Organic shapes with varied border-radius instead of perfect circles
  - Cards: Slight rotation on hover (hover:rotate-1 or hover:-rotate-1)
  - Pricing: Scale up highlighted card slightly on desktop (md:scale-105)
- **Overlap & Layering**:
  - Overlapping avatar circles with negative margin (-space-x-4)
  - Decorative elements positioned absolutely outside parent bounds
  - Speech bubble tails extending beyond card borders
- **Whitespace**:
  - Consistent section padding (py-20) for rhythm
  - Generous gap in grids (gap-8) to prevent crowding
  - Max-width containers (max-w-5xl, max-w-3xl) for focused content
- **Z-Index Layering**: Decorative SVG backgrounds at low z-index, step numbers elevated with z-10

# Non-Genericness (Bold Choices)

**Unique Visual Signatures:**
- **NO STRAIGHT LINES**: Every container, button, card, and frame uses irregular border-radius values—never standard Tailwind rounded classes
- **Hand-Drawn SVG Decorations**:
  - Arrow pointing to hero CTA with dashed path
  - Squiggly connecting line between "How It Works" steps
  - Corner frame marks on hero image placeholder
- **Authentic Paper Effects**:
  - Tape strips (translucent gray rectangles) on feature cards
  - Thumbtack pins (colored circles) for card decoration
  - Dashed circle overlay highlighting popular pricing tier
  - Speech bubble geometric tails on testimonials
- **Playful Typography Treatments**:
  - Rotating exclamation mark in hero headline
  - Wavy underline decoration on navigation links and footer headers
  - Drop-cap first letter treatment in Product Detail section
  - Post-it yellow sticky-note tag on Product Detail card
- **Scribbled Accents**:
  - Bouncing decorative circle near hero image (desktop only)
  - Dashed borders on secondary elements and dividers
  - Emoji sketches in blog post placeholders
  - Line-through hover effect on footer links
- **Interactive Personality**:
  - Buttons "press flat" by eliminating shadow on active state
  - Cards rotate slightly on hover
  - Blog cards increase shadow offset on hover for "lift" effect
  - Grayscale-to-color transition on blog images (removed in final implementation for simplicity)

# Effects & Animation
- **Hover**: "Jiggle" effect. hover:rotate-1 or hover:-rotate-2.
- **Transition**: transition-transform duration-100 (Fast and snappy).

# Spacing, Layout & Iconography
- **Max Width**: max-w-5xl (Keep it contained like a sketchbook).
- **Icons**: lucide-react icons with stroke-width={2.5} or 3.
- **Icon Style**: Enclose key icons in rough circles.

# Responsive Strategy

**Mobile-First Approach:**
- **Typography Scaling**:
  - Headings: text-4xl md:text-5xl or text-5xl md:text-6xl
  - Body text: text-lg md:text-xl or text-base md:text-xl
  - Buttons: text-lg md:text-2xl
- **Layout Stacking**:
  - All grids collapse to single column on mobile, expand to 2-3 columns on md: breakpoint
  - Hero switches from 2-column to stacked with md:grid-cols-2
  - Stats: 2-column grid on mobile (grid-cols-2), 4-column on desktop (md:grid-cols-4)
- **Hide Decorative Elements**:
  - Hand-drawn arrow near CTA: hidden md:block
  - Bouncing decorative circle: hidden md:block
  - Squiggly connecting line in "How It Works": hidden md:block
  - Dashed circle on pricing card: hidden md:block
- **Maintain Core Aesthetic**:
  - Keep wobbly borders and handwritten fonts on all screen sizes
  - Reduce rotation slightly if needed (-rotate-1 instead of -rotate-2)
  - Maintain hard offset shadows (never add blur)
  - Preserve playful personality and irregular shapes
- **Touch-Friendly Targets**:
  - Buttons use minimum h-12 (48px) for accessibility
  - Adequate spacing between interactive elements with gap-8
- **Spacing Adjustments**:
  - Section padding remains py-20 for vertical rhythm
  - Reduce horizontal padding when needed: px-6
  - Stats scale down: h-24 w-24 md:h-32 md:w-32
  - Pricing cards: p-6 md:p-8 for better mobile fit
</design-system>`,
	},
	{
		id: 'tech',
		name: '科技风格',
		description: '专业而不失前卫设计感',
		fixedPromptId: 'byPrompt',
		prompt: `<design-system>
# Design Style: Minimalist Modern

## Design Philosophy

### Core Principle

**Clarity through structure, character through bold detail.** This design system embraces modern web layouts and dynamic interactions while honoring minimalist foundations. It operates on a fundamental tension: restraint in quantity, confidence in execution. Every element that appears has earned its place—but those elements are executed with deliberate flair and precision.

Whitespace is not empty space; it's a precision instrument for directing attention. Motion is not decoration; it's communication. Color is not scattered; it's concentrated into a single, electrifying accent that commands the eye wherever it appears.

### The Visual Vibe

**Professional yet design-forward. Confident and artistic. Refined but alive.**

Imagine the intersection of a high-tech SaaS product's precision with a creative agency's bold portfolio sensibility. This design feels like it was crafted by someone who understands both engineering rigor and artistic expression—someone who knows the rules well enough to break them intentionally.

**Emotional Keywords:**
- *Confident* — Never apologetic. Elements are sized boldly, colors are vibrant, animations are purposeful.
- *Sophisticated* — The dual-font typography system, the considered color ratios, the layered shadows all whisper "we sweat the details."
- *Alive* — Subtle animations, pulsing indicators, floating elements, and hover responses create a sense that the interface is breathing.
- *Premium* — Generous whitespace, elevated surfaces, and accent-tinted shadows evoke quality and care.
- *Contemporary* — Gradient text, glassmorphic hints, and asymmetric layouts feel undeniably modern without being trendy.

**What This Design Is NOT:**
- Not sterile or clinical (despite being "minimal")
- Not generic or template-like (bold choices prevent this)
- Not busy or overwhelming (restraint in element count)
- Not flat or lifeless (texture, shadow, and motion add depth)
- Not cold or corporate (the warm serif headlines and vibrant blue inject personality)

### The DNA of This Style

#### 1. The Signature Gradient

The Electric Blue gradient (#0052FF → #4D7CFF) is the heartbeat of this design system. It's not just an accent color—it's a visual signature that creates instant recognition.

**Where it appears:**
- Primary button backgrounds
- Text highlights on key headline words
- Icon container backgrounds
- Featured card border strokes
- Testimonial accent bars
- Trend indicator badges
- CTA section buttons
- Pricing tier highlights

**Why it works:** A gradient feels more alive than a flat color. The subtle shift from deep Electric Blue to a lighter sky blue creates dimensionality and draws the eye along the element. It signals "this is important" without screaming.

#### 2. Inverted Contrast Sections

Strategic sections flip the color scheme—using the deep slate foreground color as a background with light text. This technique:
- Creates dramatic visual rhythm as users scroll
- Prevents the light theme from feeling monotonous
- Provides natural section breaks without heavy dividers
- Makes statistics and key metrics feel more impactful
- Adds sophistication through intentional contrast

**Best used for:** Stats sections, final CTAs, or any content that deserves spotlight emphasis.

#### 3. Animated Depth & Living Elements

This design breathes. Micro-animations and transitions create a sense that the interface is responsive and alive:

- **Pulsing indicators:** Small dots in badges that gently pulse, signaling "live" or "new"
- **Floating elements:** Cards in the hero that bob gently on a slow sine wave
- **Rotating decorative rings:** Dashed circles that rotate infinitely at glacial speed (60+ seconds per rotation)
- **Hover responses:** Elements lift, shadows deepen, icons scale, colors shift
- **Entrance animations:** Content fades up into view as users scroll, with staggered timing

**The philosophy:** Motion should feel natural, almost subconscious. Users shouldn't think "oh, that's animated"—they should simply feel that the interface is polished and responsive.

#### 4. Sophisticated Dual-Font Typography

The pairing of **Calistoga** (display) with **Inter** (UI/body) creates a memorable typographic identity:

- **Calistoga** is warm, characterful, and slightly playful. Its soft serifs and sturdy construction make headlines feel approachable yet substantial. It's the "personality" voice.
- **Inter** is clean, highly legible, and professional. It handles the workhorse duties of body text, labels, and UI elements. It's the "clarity" voice.

This pairing creates a conversation between personality and precision—headlines grab attention with character, then body text delivers information with crystal clarity.

**Monospace accents** (JetBrains Mono) appear in section labels and badges, adding a technical, modern touch that reinforces the "high-tech meets high-design" vibe.

#### 5. Texture Over Flatness

Minimalism often fails because it becomes sterile. This design combats flatness through layered texture:

- **Dot patterns:** Subtle radial-gradient dot grids at 2-3% opacity on dark sections
- **Radial glows:** Large, blurred circles of accent color positioned at section corners, creating ambient warmth
- **Layered shadows:** Cards don't just have one shadow—they have subtle, diffuse shadows that create realistic depth
- **Gradient overlays:** Hero sections use radial gradients of the accent color at low opacity for atmospheric depth

These textures are felt more than seen. Users won't consciously notice the dot pattern, but they'll feel that the dark section has "something" that makes it feel richer than a flat color.

#### 6. Asymmetry & Visual Tension

Strict grid alignment is intentionally broken in key moments:

- **Hero layout:** The asymmetric 1.1fr / 0.9fr grid creates visual tension—the text column is subtly dominant
- **Testimonial offset:** The center card is shifted vertically, breaking the rigid grid rhythm
- **Pricing elevation:** The highlighted tier floats above its siblings
- **Benefits visual:** Asymmetric border radii (rounded-tl-[4rem] rounded-br-[4rem]) create organic, memorable shapes

**Why this matters:** Perfect symmetry is predictable. Strategic asymmetry creates visual interest and guides the eye in unexpected ways. It's the difference between "correct" and "designed."

#### 7. The Section Label System

Every major section begins with a consistent badge pattern:
- Rounded pill shape with subtle accent border and tinted background
- Small colored dot (optionally animated/pulsing)
- Uppercase monospace text with wide letter-spacing
- Positioned above the section headline

This creates a visual rhythm and helps users orient themselves. It also adds a touch of UI sophistication—these feel like carefully designed interface elements, not just text.

### Differentiation: Minimalism With a Pulse

This style refuses to be "just clean." Many minimal designs strip away so much that they become forgettable—white backgrounds, gray text, safe choices. This design takes the opposite approach:

**Minimalism through bold choices, not absence.**

- Where others use subtle gray, we use Electric Blue
- Where others use flat backgrounds, we use inverted sections and gradient glows
- Where others use static layouts, we use floating animations and pulsing indicators
- Where others use one safe font, we use a memorable dual-font pairing
- Where others center everything, we embrace asymmetry

The result is a design that is unmistakably minimal in its restraint (few colors, generous whitespace, clean lines) but unmistakably bold in its execution (vibrant accent, animated hero, gradient flourishes).

**It's minimalism that makes a statement.**

### Sensory Description

If this design were a physical space, it would be:
- A bright, airy gallery with white walls and polished concrete floors
- One wall painted in deep midnight blue, dramatically lit
- A single piece of art in electric blue, drawing every eye
- Soft ambient lighting that makes surfaces glow
- The faint hum of something technological and precise
- Clean lines everywhere, but one sculptural element with an unexpected curve

If it were music, it would be:
- Electronic, but warm—not cold synthwave
- Mostly minimal beats with generous silence
- One recurring melodic hook in a bright, clear tone
- Occasional swells that feel like things floating upward
- Professional enough for a corporate lobby, interesting enough to actually listen to

---

## Design Token System (The DNA)

### Color Strategy

**Chromatic Focus:** A warm, near-monochrome palette amplified by a dual-tone accent gradient. The accent colors are used sparingly but with maximum impact—they command attention wherever they appear.

| Token | Value | Usage & Context |
|:------|:------|:----------------|
| background | #FAFAFA | Primary canvas. Warmer off-white that reduces eye strain. |
| foreground | #0F172A (Slate-900) | Primary text. Deep slate, not pure black. Also used as inverted section backgrounds. |
| muted | #F1F5F9 (Slate-100) | Secondary surfaces, card backgrounds, subtle fills. |
| muted-foreground | #64748B (Slate-500) | Secondary text, descriptions, metadata. |
| accent | #0052FF (Electric Blue) | **Primary action color.** CTAs, links, highlights, icon backgrounds. |
| accent-secondary | #4D7CFF | Gradient endpoint. Used with accent for gradient effects. |
| accent-foreground | #FFFFFF | Text on accent backgrounds. Always white. |
| border | #E2E8F0 (Slate-200) | Subtle structural borders on cards and dividers. |
| card | #FFFFFF | Elevated surfaces. Pure white for maximum lift. |
| ring | #0052FF | Focus rings. Matches the primary accent. |

**The Signature Gradient:**
css
background: linear-gradient(to right, #0052FF, #4D7CFF);
/* Or diagonal: */
background: linear-gradient(135deg, #0052FF, #4D7CFF);

This gradient appears on: primary buttons, featured badges, icon backgrounds, pricing tier borders, testimonial accent bars, trend indicators, and text highlights.

---

### Typography System

**Font Pairing (Dual-Font System):**
- **Display Font:** "Calistoga", Georgia, serif — A warm, characterful serif with personality. Used exclusively for h1/h2 headlines to create memorable anchor points.
- **UI & Body Font:** "Inter", system-ui, sans-serif — Highly legible, clean sans-serif for all body text, UI elements, and smaller headings.
- **Monospace:** "JetBrains Mono", monospace — For section labels, badges, and technical callouts.

**Type Scale & Usage:**

| Element | Size | Font | Weight | Tracking | Notes |
|:--------|:-----|:-----|:-------|:---------|:------|
| Hero Headline | 5xl → 5.25rem | Calistoga | Normal | -0.02em | Tight leading (1.05). Last word gets gradient text treatment. |
| Section Headlines | 3xl → 3.25rem | Calistoga | Normal | Normal | Leading 1.15. Key word can use gradient text. |
| Card Titles | lg → 2xl | Inter | Semibold (600) | -0.01em | Tight tracking for density. |
| Body Text | base → lg | Inter | Normal (400) | Normal | Relaxed line-height (1.625-1.75). |
| Section Labels | xs (12px) | JetBrains Mono | Normal | 0.15em | UPPERCASE. Used in pill badges with accent dot. |

**Gradient Text Effect (with Enhanced Underline):**
css
.gradient-text {
  background: linear-gradient(to right, #0052FF, #4D7CFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Gradient underline bar for hero headline */
.gradient-underline {
  position: absolute;
  bottom: -0.25rem; /* md: -0.5rem */
  left: 0;
  height: 0.75rem; /* md: 1rem */
  width: 100%;
  border-radius: 0.125rem;
  background: linear-gradient(to right, rgba(0, 82, 255, 0.15), rgba(77, 124, 255, 0.1));
}


---

### Spacing & Layout

**Core Principle:** Generous, intentional whitespace is a primary design tool—but it's balanced by density within components.

- **Section Spacing:** Large vertical padding (py-28 to py-44) creates a calm, paced scrolling experience.
- **Container Width:** max-w-6xl (72rem) for primary content. Centered with mx-auto.
- **Component Density:** Within cards and components, spacing is tighter to create cohesive units that float in the generous section whitespace.
- **Grid Gaps:** gap-5 to gap-8 between grid items. Slightly tighter than standard to maintain visual cohesion.

**Asymmetry Patterns:**
- Hero: grid-cols-[1.1fr_0.9fr] — Left-heavy for text dominance
- Benefits: grid-cols-[1.2fr_0.8fr] — Content over visual
- Use negative margins and overlapping elements to create Z-depth

---

### Borders, Surfaces & Shadows

**Surfaces:**
- Cards use pure white (#FFFFFF) with 1px border in border color
- Elevated cards add shadow-lg or shadow-xl for lift
- Featured elements use gradient borders (2px stroke effect via nested divs)

**Shadow System:**
| Token | Value | Usage |
|:------|:------|:------|
| shadow-sm | 0 1px 3px rgba(0,0,0,0.06) | Subtle lift |
| shadow-md | 0 4px 6px rgba(0,0,0,0.07) | Standard cards |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.08) | Elevated cards |
| shadow-xl | 0 20px 25px rgba(0,0,0,0.1) | Hero elements |
| shadow-accent | 0 4px 14px rgba(0,82,255,0.25) | Accent-tinted lift |
| shadow-accent-lg | 0 8px 24px rgba(0,82,255,0.35) | Featured elements |

**Textures (Critical for Avoiding Flatness):**
- **Dot Pattern:** radial-gradient(circle, white 1px, transparent 1px) at 32px intervals, opacity: 0.03 — Used on dark inverted sections
- **Radial Glows:** Large blurred circles (blur-[150px]) of accent color at 3-6% opacity — Positioned at section corners
- **Gradient Overlays:** Subtle radial-gradient from accent color, 8% opacity — Used in hero graphic backgrounds

---

## Component Styling & Interactions

### Buttons

**Primary Button:**
- Background: Gradient from accent to accent-secondary (bg-gradient-to-r from-[var(--accent)] to-[#4D7CFF])
- Text: White, medium weight
- Shadow: shadow-sm default, shadow-accent on hover (accent-tinted)
- Border-radius: rounded-xl (12px)
- Hover: Lifts up (-translate-y-0.5), shadow-accent-lg, brightness increase (brightness-110), arrow icon translates right
- Active: Slight scale down (scale-[0.98]) for tactile feedback

**Secondary/Outline Button:**
- Background: Transparent → muted on hover
- Border: 1px in border color
- Text: foreground
- Hover: Border shifts to accent/30, shadow appears

**Ghost Button:**
- No background or border
- Text: muted-foreground → foreground on hover

**Animation:** All buttons have transition-all duration-200. Subtle upward translation on hover (-translate-y-0.5). Arrow icons translate right on hover (group-hover:translate-x-1).

---

### Cards

**Standard Card:**
- Background: card (white)
- Border: 1px in border color
- Border-radius: rounded-xl (12px) or rounded-2xl (16px)
- Shadow: shadow-md default, shadow-xl on hover
- Padding: p-6 to p-10 depending on prominence

**Elevated Card:**
- Adds stronger shadow and optional accent tint
- Used for featured items, highlighted pricing tiers

**Hover Effects:**
- Gradient overlay fades in: bg-gradient-to-br from-accent/[0.03] to-transparent
- Shadow deepens
- Optional icon scale: group-hover:scale-110

**Featured Card (Gradient Border):**
jsx
<div className="rounded-xl bg-gradient-to-br from-accent via-accent-secondary to-accent p-[2px]">
  <div className="h-full w-full rounded-[calc(12px-2px)] bg-card">
    {/* content */}
  </div>
</div>


---

### Inputs

- Height: h-12 to h-14
- Border: 1px in border color
- Border-radius: rounded-lg or rounded-xl
- Background: Transparent or very subtle muted/10
- Focus: ring-2 ring-accent ring-offset-2
- Placeholder: text-muted-foreground/50

---

### Section Labels (Badges)

A consistent badge pattern appears at the start of each section:
jsx
<div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2">
  <span className="h-2 w-2 rounded-full bg-accent" /> {/* Can be animated/pulsing */}
  <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
    Section Name
  </span>
</div>


---

## The "Bold Factor" (Signature Elements)

These elements define this implementation and prevent generic output:

1. **Gradient Text Highlights:** Key words in headlines use the signature gradient as text color via bg-clip-text.

2. **Inverted Sections:** At least one section uses bg-foreground text-background with dot pattern texture for dramatic contrast.

3. **Animated Hero Graphic:** Abstract generative composition with:
   - Rotating outer ring (animate with 60s duration, linear)
   - Floating cards with staggered y animations (5s and 4s durations, ±10px movement)
   - Geometric shapes (circles, rounded rectangles, gradient fills)
   - Decorative dot grid (3x3)
   - Corner accent block in solid accent with shadow

4. **Gradient Icon Backgrounds:** Feature icons use full gradient backgrounds (from-accent to-accent-secondary) rather than translucent fills.

5. **Gradient Border Effects:** Highlighted elements (pricing tiers, featured cards) use the 2px gradient stroke technique.

6. **Large Decorative Elements:** Quote marks at 120px, step numbers at text-4xl, trend arrows in badges.

7. **Pulsing Indicators:** Animated dots in badges using scale/opacity keyframes.

8. **Arrow Connectors:** Timeline steps connected by small accent-colored circular badges with arrow icons.

---

## Effects & Animation

**Motion Philosophy:** Smooth, confident, and purposeful. Animations enhance understanding and add delight without being distracting. All motion follows natural easing curves.

**Transition Defaults:**
- Standard: transition-all duration-200 ease-out
- Entrance: duration-700 with stagger (0.1s delay between children)
- Hover lifts: duration-300
- Button active: duration-200 with scale down

**Entrance Animations (Framer Motion):**
js
const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: easeOut } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};


**Continuous Animations:**
- Rotating ring: 60s linear infinite rotation (hero graphic)
- Floating cards: 4-5s ease-in-out infinite y-axis bobbing (±10px amplitude)
- Pulsing dot: 2s infinite scale/opacity pulse (scale: [1, 1.3, 1], opacity: [1, 0.7, 1])
- Activity indicators: 3s infinite scale/opacity pulse (subtle)

---

## Responsive Strategy

**Breakpoint Philosophy:** Mobile layouts simplify structure but maintain the bold aesthetic. Touch targets are 44px+ minimum.

- **Hero:** Single column. Hide abstract graphic on small screens. Stack CTAs vertically with full width (w-full sm:w-auto).
- **Stats:** 2 columns on mobile → 4 columns on desktop with vertical dividers hidden on mobile
- **Features:** 1 column → 2 columns (md) → 3 columns (lg) with first card spanning on larger screens
- **How It Works:** Vertical stack on mobile, horizontal timeline with connecting line on desktop (md+)
- **Pricing:** Stack vertically, highlighted tier maintains elevation and gradient border
- **Testimonials:** Stack vertically, center card offset removed on mobile
- **Final CTA:** Input and button stack vertically on mobile, horizontal on sm+, button goes full width on mobile

**Key Adaptations:**
- Reduce headline sizes: text-[2.75rem] mobile → text-6xl → text-[5.25rem] desktop
- Maintain generous section padding: py-28 → py-44 (reduce slightly, not dramatically)
- Hide decorative elements on mobile: rotating rings, complex graphics (use hidden lg:block)
- Keep gradient accents and color inversions—these define the style
- Button heights: h-12 to h-14 for primary CTAs (44px-56px touch targets)

---

## Accessibility & Best Practices

**Color Contrast:** All text meets WCAG AA. The accent blue (#0052FF) on white background passes at 4.5:1+. Inverted sections use near-white text (#FFFFFF or rgba(255,255,255,0.9)) on deep slate (#0F172A) for maximum contrast.

**Focus States:**
- Visible focus rings using ring-2 ring-accent ring-offset-2 with ring-offset-background
- Focus rings match the gradient accent aesthetic
- Interactive elements have clear hover/focus differentiation (lift, shadow, color shift)
- Buttons have active:scale-[0.98] for tactile feedback

**Touch Targets:**
- Minimum 44px height on all interactive elements
- Buttons use h-12 (48px) to h-14 (56px) for primary CTAs
- Adequate spacing between tap targets (gap-4 minimum)

**Motion:**
- Respect prefers-reduced-motion for continuous animations
- Entrance animations are subtle enough to not cause issues (0.7s duration, 28px vertical movement)
- No flashing or rapid movements
- Continuous animations are slow and gentle (4-5s duration, ±10px movement)

---

## Implementation Notes

**Component Structure:**
All components (Button, Card, Input) are built locally using cva and tailwind-merge, following Shadcn API patterns but tailored to this design system.

**CSS Custom Properties:**
The StyleWrapper component injects all design tokens as CSS custom properties, allowing for consistent theming across all components.

**Font Loading:**
Fonts are loaded via Google Fonts:
- Inter: weights 400, 500, 600, 700
- Calistoga: default weight
- JetBrains Mono: weights 400, 500

**Animation Library:**
Framer Motion is used for all entrance animations and continuous motion. Viewport options are set to { once: true, amount: 0.15, margin: "-60px" } for optimal performance and timing.
</design-system>
	
# 待排版的文字`,
	},
	{
		id: 'retro',
		name: '复古',
		description: '丑陋却酷炫的 90 年代怀旧美学',
		fixedPromptId: 'byPrompt',
		prompt: `<design-system>
# Retro / 90s Nostalgia Design System

## Design Philosophy

**Core Principles**: Embrace the raw, unfiltered aesthetic of the early web. This design celebrates the "ugly-cool" charm of 1990s websites—beveled buttons, system fonts, garish colors, and animated elements. It's deliberately anti-modern, rejecting minimalism in favor of maximum visual impact and nostalgic authenticity. Every pixel should feel like it was crafted in 1997 on a Windows 95 machine.

**Vibe**: Playful, chaotic, nostalgic, and unapologetically loud. Think GeoCities pages, "Under Construction" banners, hit counters, and guestbooks. This isn't about looking dated—it's about capturing the optimistic, experimental spirit of the early internet when everyone was just figuring things out. The aesthetic should feel authentic enough that someone who lived through the era would smile with recognition.

**Historical Context**: This style peaked between 1995-1999, when personal computers used Windows 95/98, monitors were 800x600 resolution, and web browsers offered limited CSS. Designers worked within severe constraints, which produced a distinctive visual language we're faithfully recreating.

---

## Design Token System (The DNA)

### Colors (Light Mode Only)

This palette is pulled directly from Windows 95 system colors and early web hex values.

| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| background | #C0C0C0 | Primary page background | Classic Windows 95 button face gray |
| foreground | #000000 | Pure black text | Maximum contrast, no grays for body text |
| muted | #808080 | Secondary elements, metadata | Exactly 50% gray (128,128,128) |
| accent | #0000FF | Hyperlinks (unvisited) | Pure blue at maximum saturation |
| secondary | #FF0000 | Hot red for emphasis | Pure red at maximum saturation |
| tertiary | #FFFF00 | Bright yellow highlights | Pure yellow, used for badges and highlights |
| success | #00FF00 | Lime green | Pure green at maximum saturation |
| successDark | #00AA00 | Darker green for buttons | More readable green variant |
| border | #000000 | Pure black borders | Used for outer borders |
| borderLight | #FFFFFF | White for 3D highlight | Top/left bevel edge |
| borderDark | #808080 | Gray for 3D shadow | Bottom/right bevel edge |
| titleBar | #000080 | Windows title bar navy | Pure dark blue (Navy) |
| titleBarGradientEnd | #1084D0 | Title bar gradient | Windows 98 active window gradient |
| panelYellow | #FFFFCC | Light yellow content panels | Authentic Windows notepad/help color |
| visitedLink | #800080 | Visited hyperlinks | Purple/Maroon |
| hoverLink | #FF0000 | Link hover state | Red |

**Color Relationships**:
- All colors are at maximum saturation (pure RGB values with at least one channel at 0 or 255)
- No gradual grays - only #000000, #808080, #C0C0C0, #FFFFFF
- Links follow the classic progression: Blue → Purple (visited) → Red (hover)

### Typography

**Font Stacks** (System fonts that evoke 1995-1999):
- **Primary Body**: "MS Sans Serif", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif
- **Headings**: "Arial Black", Impact, Haettenschweiler, sans-serif (heavy, bold weights only)
- **Monospace**: "Courier New", Courier, monospace (for dates, stats, counters, code-like elements)
- **Playful accent** (ultra-sparingly): "Comic Sans MS", cursive (only for "fun" decorative elements if needed)

**Type Scale**:
- **H1 Hero**: 48px-96px (3xl to 6xl), always UPPERCASE or Title Case, Arial Black/Impact
- **H2 Section**: 32-48px (2xl to 4xl), often UPPERCASE, Arial Black
- **H3 Subsection**: 20-24px (lg to xl), bold weight
- **Body**: 14-16px, default weight, readable density
- **Small/Meta**: 12px (xs), often monospace for dates and metadata
- **Labels**: 10-12px, UPPERCASE, sometimes monospace

**Typographic Patterns**:
- Headings are BOLD or BLACK weight - no thin or light fonts exist in this era
- Letter-spacing on UPPERCASE headings: tracking-tight to tracking-wide (not expanded)
- Line-height: Dense (1.2-1.4 for headings, 1.5-1.6 for body)
- Text shadows for 3D text: text-shadow: 2px 2px 0 #808080 (hard-edged, no blur)

### Radius & Borders

**Border Radius**: 0px EVERYWHERE. No exceptions. The 90s didn't have border-radius.

**Border Widths**:
- Standard: 2px for most elements
- Emphasis: 4px for section dividers and highlighted elements
- Minimum: 1px only for subtle inner detail (rare)

**3D Bevel Effect** (THE SIGNATURE):

This is the most critical visual element. Windows 95 used a specific 4-value border-color syntax combined with box-shadow for depth.

**Outset (Raised) - Elements that appear to pop out**:
css
border: 2px solid;
border-color: #ffffff #808080 #808080 #ffffff; /* Top Right Bottom Left */
box-shadow: inset -1px -1px 0 #404040, inset 1px 1px 0 #dfdfdf;

- Top and left edges: white (#ffffff)
- Bottom and right edges: gray (#808080)
- Inner shadow adds depth with darker (#404040) and lighter (#dfdfdf) accents

**Outset Enhanced (Deeper bevel)**:
css
border: 2px solid;
border-color: #ffffff #808080 #808080 #ffffff;
box-shadow:
  inset -2px -2px 0 #808080,
  inset 2px 2px 0 #fff,
  inset -4px -4px 0 #404040,
  inset 4px 4px 0 #dfdfdf;


**Inset (Sunken) - Elements that appear pressed in**:
css
border: 2px solid;
border-color: #808080 #ffffff #ffffff #808080; /* REVERSED from outset */
box-shadow: inset 1px 1px 0 #404040, inset -1px -1px 0 #dfdfdf;

- Top and left edges: gray (#808080)
- Bottom and right edges: white (#ffffff)
- Inner shadow creates recessed appearance

**Active/Pressed State**:
When an outset element is clicked, it becomes inset AND translates 1px down and right:
css
border-color: #808080 #ffffff #ffffff #808080;
box-shadow: inset 1px 1px 0 #404040, inset -1px -1px 0 #dfdfdf;
transform: translate(1px, 1px);


**Tailwind Implementation**:
Use arbitrary values with underscores for spaces:
- [border-color:#fff_#808080_#808080_#fff] for outset
- [border-color:#808080_#fff_#fff_#808080] for inset
- [box-shadow:inset_-1px_-1px_0_#404040,inset_1px_1px_0_#dfdfdf]

### Textures & Patterns (MANDATORY)

The background must NOT be flat. This is critical for authenticity.

**90s Tiled Pattern** (Primary technique):
css
background-color: #c0c0c0;
background-image:
  linear-gradient(45deg, #b8b8b8 25%, transparent 25%),
  linear-gradient(-45deg, #b8b8b8 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #b8b8b8 75%),
  linear-gradient(-45deg, transparent 75%, #b8b8b8 75%);
background-size: 4px 4px;
background-position: 0 0, 0 2px, 2px -2px, -2px 0px;

This creates a subtle diagonal crosshatch that gives texture without being distracting.

**Construction Warning Stripes** (For emphasis areas):
css
background: repeating-linear-gradient(
  45deg,
  #ffff00,
  #ffff00 10px,
  #000000 10px,
  #000000 20px
);

Exactly 10px yellow, 10px black stripes at 45-degree angle.

**Horizontal Rule (HR) with Groove Effect**:
css
border: none;
height: 4px;
background: linear-gradient(
  to bottom,
  #808080 0%, #808080 50%,
  #ffffff 50%, #ffffff 100%
);

Creates the classic "etched" divider look.

---

## Component Styling Principles

### Buttons

**Visual Requirements**:
- Border: 2px with 4-value outset color pattern
- Background: Subtle gradient or solid color depending on variant
- Text: Bold, UPPERCASE with tracking-wide, centered
- Padding: 8px vertical, 16px horizontal (comfortable clickable area)
- NO border-radius
- NO soft drop shadows

**State Transitions**:
- **Default**: Outset bevel, slightly lighter background on hover
- **Hover**: Background lightens by 1-2 shades, maintain outset
- **Active/Pressed**: Inset bevel (reversed border-color), translate(1px, 1px)
- **Focus**: Dotted 2px black outline, 2px offset (Windows 95 focus ring)
- **Transition**: NONE or instant (transition-none or 50ms max) - no smooth easing

**Variants**:
1. **Default/Ghost**: #C0C0C0 background, black text, outset bevel
2. **Accent/Primary**: #0000FF background, white text, blue-tinted bevel edges
3. **Danger**: #FF0000 background, white text, red-tinted bevel edges
4. **Success**: #00AA00 (readable green) background, white text, green-tinted bevel
5. **Outline**: White background, black text, outset bevel

**Bevel Color Tinting**:
For colored buttons, tint the bevel edges to match:
- Blue button: border-color: #5555ff #000080 #000080 #5555ff
- Red button: border-color: #ff5555 #800000 #800000 #ff5555
- Green button: border-color: #00ff00 #006600 #006600 #00ff00

**Example Tailwind Classes**:

border-2
bg-[#c0c0c0]
text-black
[border-color:#fff_#808080_#808080_#fff]
[box-shadow:inset_-1px_-1px_0_#404040,inset_1px_1px_0_#dfdfdf]
hover:bg-[#d0d0d0]
active:[border-color:#808080_#fff_#fff_#808080]
active:[box-shadow:inset_1px_1px_0_#404040,inset_-1px_-1px_0_#dfdfdf]
active:translate-x-[1px]
active:translate-y-[1px]
focus-visible:outline-dotted
focus-visible:outline-2
focus-visible:outline-black
focus-visible:outline-offset-2


### Cards/Containers

**Panel/Card Structure**:
- Container: 2px outset bevel, #C0C0C0 background
- Title bar: Gradient linear-gradient(to right, #000080, #1084d0), white text, bold, 4-8px padding
- Content area: Inset bevel (sunken), white or #FFFFCC (yellow) background

**Window-Style Card** (Most distinctive):

Outer container: outset bevel, gray background
├── Title bar: navy gradient (#000080 → #1084d0), white bold text
└── Content area: inset bevel, white background, padding 16px


**Alternating Row Backgrounds**:
For table-like layouts, alternate between:
- Even rows: #FFFFFF (white)
- Odd rows: #E8E8E8 (light gray)

This creates the classic spreadsheet/database appearance.

**Borders Between Cells**:
Use border-right-2 and border-bottom-2 with #808080 to create visible grid lines.

### Form Inputs

**Input Fields**:
- Border: 2px inset (sunken appearance)
- Background: White
- Text: Black, 14-16px
- Padding: 4-8px
- Focus: Dotted 2px black outline, 2px offset
- Disabled: #C0C0C0 background, 50% opacity

**Placeholder Text**: #808080 (gray)

**Select Dropdowns**: Same inset styling as inputs

**Checkboxes/Radio**: Not common in 90s web (use text indicators or simple squares)

### Links (Hyperlinks)

The most iconic element of the 90s web.

**States**:
- **Unvisited**: #0000FF (blue), underlined always
- **Visited**: #800080 (purple)
- **Hover**: #FF0000 (red)
- **Active** (while clicking): #FF0000 (red)

**Rules**:
- ALWAYS underlined (never remove text-decoration)
- Color changes are instant (no transitions)
- No background on hover
- No additional styling effects

**Example**:

text-[#0000ff]
underline
hover:text-[#ff0000]
visited:text-[#800080]


### Icons

**Styling**:
- Stroke width: 2px or stroke-[2px] (thick, bold lines)
- Color: Match the accent color of the section (blue, red, green)
- Size: 24px (h-6 w-6) standard, 32px for features
- NO rounded corners or soft shapes
- Consider adding 2px black borders around icon containers

**Icon Containers**:
If placing icons in colored boxes:
- Box background: Solid bright color (#000080, #008080, #00AA00)
- Icon color: White
- Box style: Outset or flat with borders

---

## Layout Principles

### Page Structure

**Maximum Width**: max-w-5xl (1024px) - mimics 800x600 monitor content area with browser chrome

**Spacing System**:
- Base unit: 8px
- Element padding: 16px (generous interior spacing)
- Element margins: 8-16px (tighter exterior spacing for density)
- Section padding: 64px vertical (py-16), 16px horizontal (px-4)

**Section Dividers**:
Use thick borders (border-b-4 border-[#808080]) OR the groove HR effect between major sections.

**Grid Layouts**:
Even though using modern CSS Grid/Flexbox, make it LOOK like tables:
- Visible cell borders with border-2 or border-r-2/border-b-2
- Alternating row backgrounds
- Equal column widths where possible
- Dense, compact spacing

### Responsive Strategy

**Desktop** (768px+):
- Full table-like layouts with side-by-side columns
- Multi-column grids (2-4 columns)
- Visible complex borders

**Tablet** (640-768px):
- Reduce to 2 columns max
- Maintain all visual styling (bevels, borders)
- Stack complex tables if needed

**Mobile** (<640px):
- Single column
- KEEP beveled effects (essential to the style)
- Marquee continues to scroll
- Reduce font sizes slightly but keep bold weights
- Horizontal scrolling for complex tables is acceptable (authentic!)

**Important**: The aesthetic is more important than perfect responsiveness. It's okay if the mobile experience is slightly janky—that's authentic to the era.

---

## The "Bold Factor" (Non-Genericness)

**MANDATORY ELEMENTS** - These must be present or the style fails:

### 1. Marquee Scrolling Text
Use react-fast-marquee or pure CSS marquee for:
- Announcement bars with colorful text
- Testimonial carousels
- "Breaking news" style updates

**Settings**:
- Speed: 30-60 (moderate pace)
- No gradient fade (gradient={false})
- Multiple spans with different colors

### 2. Animated Rainbow Text
CSS animation cycling through bright colors for hero headlines:
css
@keyframes rainbow {
  0% { color: #ff0000; }
  17% { color: #ff8000; }
  33% { color: #ffff00; }
  50% { color: #00ff00; }
  67% { color: #0080ff; }
  83% { color: #8000ff; }
  100% { color: #ff0000; }
}
animation: rainbow 4s linear infinite;

**Duration**: 4 seconds, linear easing (no smoothing)

### 3. Beveled Everything
Every interactive element and most containers must have the 3D outset/inset effect. This is NON-NEGOTIABLE.

### 4. "Under Construction" Energy
Add small animated elements:
- Blinking "NEW!" badges (use animate-pulse or CSS blink with step-end)
- Pulsing call-to-action badges
- Color-cycling decorative elements

**Pulse Glow Animation** (for badges):
css
@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.5);
  }
}
animation: pulse-glow 1.5s ease-in-out infinite;


### 5. Horizontal Rules (HR) as Dividers
Use the 3D groove effect between major content sections. This is a signature 90s pattern.

### 6. Hit Counter Aesthetic
Style at least one stats section like a classic hit counter:
- Black or navy background
- Green monospace text (#00FF00)
- Beveled inset frame
- Text like "Visitors: 0001234 | Since 1995"

### 7. Table-Like Visual Layouts
Even when using modern CSS, create the appearance of HTML tables:
- Visible cell borders (border-2 border-[#808080])
- Alternating row backgrounds
- Grid-like precision

### 8. Title Bar Windows
Cards should look like Windows 95 application windows:
- Navy-to-blue gradient title bar
- White bold text in title
- Inset content area below

### 9. Decorative Color Squares
Include at least one section with a grid of bright colored squares (red, green, blue, yellow, magenta, cyan) with beveled edges. This is pure decorative 90s excess.

### 10. Construction Stripe Background
Use the yellow/black diagonal stripe pattern for at least one emphasized section (like final CTA).

---

## Animation & Motion

**Motion Philosophy**: Snappy, immediate, digital. No organic easing curves.

**Timing Functions**:
- **Instant state changes**: transition-none or duration-0
- **Color cycling**: linear (no easing)
- **Badges/pulses**: ease-in-out (acceptable for attention effects)
- **Button press**: transition-none or max 50ms

**Durations**:
- Button press: Instant or 50ms
- Hover color change: 75ms or instant
- Rainbow text cycle: 3-5 seconds
- Pulse glow: 1-2 seconds
- Marquee speed: Moderate (40-60px/second)

**Key Animations**:

1. **Rainbow Text**: 4s linear infinite loop through spectrum
2. **Pulse Glow**: 1.5s ease-in-out infinite for "NEW!" badges
3. **Blink** (ultra-sparingly): 1s step-end infinite (harsh on/off, not fade)
4. **Marquee**: Continuous scroll, pauseOnHover for usability

**Reduced Motion**:
Respect prefers-reduced-motion:
- Stop rainbow animation (fallback to single bright color)
- Stop marquee (show static or slower scroll)
- Stop pulsing badges (static with bright color)

---

## Accessibility

**Color Contrast**:
- Black (#000000) on silver (#C0C0C0): 7.5:1 (AAA)
- White on navy (#000080): 8.6:1 (AAA)
- White on blue (#0000FF): 8.6:1 (AAA)
- The palette naturally provides excellent contrast

**Focus States**:
- 2px dotted black outline (Windows 95 authentic)
- 2px offset from element
- High visibility, matches the aesthetic
- NEVER remove focus indicators

**Keyboard Navigation**:
- All interactive elements must be keyboard accessible
- Tab order should follow visual order
- Button press on Enter/Space should show active state

**Screen Readers**:
- Marquee text must have static alternative or be aria-live="polite"
- Decorative animated elements should be aria-hidden
- Color squares and decorative patterns need no alt text
- Ensure semantic HTML even with table-like appearance

**Motion Sensitivity**:
Provide prefers-reduced-motion alternatives:
css
@media (prefers-reduced-motion: reduce) {
  .text-rainbow { animation: none; color: #ff0000; }
  .animate-pulse-glow { animation: none; }
  /* Marquee handled by library or CSS */
}


---

## Anti-Patterns (What to AVOID)

### Visual No-Nos:
1. **NO border-radius** - Not even 1px. Zero. Always.
2. **NO soft drop shadows** - Only use inset shadows for bevels
3. **NO gradients** except:
   - Title bar gradient (navy to blue)
   - Background patterns (stripes, tiles)
   - Subtle button backgrounds
4. **NO semi-transparent overlays** - Colors are always opaque (except white/80 for secondary text on dark backgrounds)
5. **NO thin fonts** - Everything is bold or black weight
6. **NO subtle grays** - Only #000000, #808080, #C0C0C0, #FFFFFF, #E8E8E8
7. **NO smooth easing** - Use linear or instant transitions
8. **NO removing link underlines** - Always visible
9. **NO modern minimalist spacing** - Dense, not airy
10. **NO attempting to "modernize" the aesthetic** - Embrace the cheese

### Interaction No-Nos:
1. **DON'T use hover states that scale elements** (except 1.05 for pulse badges)
2. **DON'T use fade transitions** - Changes should be instant or linear
3. **DON'T make marquee text essential content** - Keep it decorative/supplemental
4. **DON'T override browser default selection color** - Actually, DO: use #000080 background, white text
5. **DON'T use floating action buttons** or modern UI patterns

### Content No-Nos:
1. **DON'T use placeholder text** that doesn't fit the era (no "lorem ipsum")
2. **DON'T reference modern tech** in decorative text (keep it generic or 90s-themed)
3. **DON'T be subtle** - This style is LOUD and PROUD

---

## Implementation Notes

### Tailwind Arbitrary Values
You'll use these constantly:

border-[2px]
[border-color:#fff_#808080_#808080_#fff]
[box-shadow:inset_-1px_-1px_0_#404040,inset_1px_1px_0_#dfdfdf]
bg-[#c0c0c0]
text-[#0000ff]

Note: Use underscores for spaces in arbitrary values.

### Custom CSS Required
Some effects need CSS files:
- @keyframes for rainbow, pulse-glow, blink
- .hr-groove for horizontal rule effect
- .bg-90s-tile for tiled background pattern
- .bg-construction for warning stripes

### Dependencies
- **react-fast-marquee**: Essential for authentic scrolling text
- Consider creating CSS variables for the complex box-shadow values for reusability

### Color Layering Strategy
1. **Base**: Tiled #C0C0C0 background
2. **Surface**: White or gray (#E8E8E8) panels with bevels
3. **Accent surfaces**: Navy title bars, colored feature boxes
4. **Foreground**: Black text, colored icons
5. **Highlights**: Yellow badges, red "NEW!" tags, rainbow text

---

## Signature Visual Checklist

Before considering the design complete, verify these are present:

- [ ] At least one marquee scrolling element with colorful text
- [ ] Rainbow animated text on hero or major heading
- [ ] All buttons have 3D outset bevels with proper border-color syntax
- [ ] At least one card with Windows 95 title bar gradient
- [ ] Tiled background pattern visible on main body
- [ ] Hyperlinks are blue/underlined, turn red on hover
- [ ] At least one section with alternating row backgrounds
- [ ] Horizontal groove rule divider between major sections
- [ ] A "hit counter" style stats display with monospace green text
- [ ] One "NEW!" or "HOT!" badge with pulse animation
- [ ] Construction stripe background on at least one section
- [ ] All interactive elements have dotted focus outlines
- [ ] Active buttons show pressed state (inset + translate)
- [ ] Icons have 2px stroke width
- [ ] Zero instances of border-radius anywhere

---

## The Secret Sauce

What makes this style work is **commitment to authenticity over modernization**. The temptation will be to "clean it up" or "make it more professional." Resist this. The ugliness IS the beauty. The clashing colors, the dense layouts, the aggressive animations—these aren't bugs, they're features.

Someone who lived through 1997 should look at this and immediately feel transported back. The design should be so authentic that it's almost jarring next to modern websites. That contrast IS the point.

Embrace the cheese. Celebrate the chaos. Welcome to 1997.
</design-system>`,
	},
];

// {
// 		id: '',
// 		name: '',
// 		description: '',
// 		fixedPromptId: 'byPrompt',
// 		prompt: ``
// 	},
