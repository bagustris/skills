---
name: marp-markdown-authoring
description: Create, edit, and validate Marp markdown presentations from raw notes. Use when a user asks for slide generation, Marp markdown syntax, command usage, speaker notes conversion, image layout, transitions, or per-slide styling in Marp-compatible markdown.
---

# Marp Markdown Authoring

Use this skill to turn rough notes into production-ready Marp markdown.

## Workflow: Notes to Slides

1. Extract structure from notes:
- Identify title slide content, core sections, and closing slide.
- Group bullets by one idea per slide.
- Mark optional presenter-only details as HTML comment notes.

2. Build a deck plan:
- 1 title slide.
- 1 agenda/overview slide if useful.
- Main content slides (one primary message each).
- 1 summary/CTA slide.

3. Generate markdown:
- Place front-matter YAML at the top between `---` delimiters.
- Separate slides with `---`.
- Use HTML comment directives (`<!-- _directive: value -->`) for per-slide overrides.
- Keep slide text concise. Move detail into presenter notes (`<!-- ... -->`).

4. Validate:
- Confirm front-matter YAML is valid and closed.
- Confirm per-slide directives use underscore prefix for spot scope.
- Confirm image modifiers are in alt text.
- Confirm fenced code blocks are balanced and typed.

## Output Contract

- Default output is pure markdown only.
- Do not add explanatory prose unless requested.
- Preserve directive spellings exactly.
- Prefer working examples over placeholders.

## Marp Syntax and Commands

### Core Markdown

- Headings: `#`, `##`, `###`, `####`
- Unordered lists: `- item`
- Ordered lists: `1. item`
- Nested lists: indent by 2 or 4 spaces
- Emphasis: `*italic*`, `**bold**`, `_italic_`, `__bold__`, `~~strikethrough~~`
- Inline code: `` `code` ``
- Superscript/Subscript: `<sup>text</sup>`, `<sub>text</sub>`
- Blockquotes: `> Quote text`
- Links: `[Label](https://example.com)`
- Tables: standard GFM pipe tables with header separator `---`
- Line breaks: two trailing spaces or `<br>`
- HTML comments hide content from slide output: `<!-- hidden -->`

### Slide Separators

- `---` on its own line starts a new slide
- `headingDivider` global directive auto-splits at heading levels (see Global Directives)

### Code Blocks

- Fenced code with language specifier:
  ````markdown
  ```javascript
  const x = 1;
  ```
  ````
- Syntax highlighting via highlight.js — specify any supported language name.

### Presenter Notes

- Any HTML comment becomes a presenter note (hidden from slide, shown in presenter view):
  ```markdown
  <!-- This is a speaker note. Can span
  multiple lines. -->
  ```
- Notes are visible in Marp CLI presenter view and exported to HTML/PPTX.
- Notes are NOT included in PDF or image exports by default (use `--pdf-notes` flag in marp-cli).

### Global Directives (Front-Matter)

Place at the very top of the file inside a YAML front-matter block:

```yaml
---
theme: default
paginate: true
header: "My Presentation"
footer: "2026"
headingDivider: 2
lang: en
style: |
  h1 { color: #336699; }
---
```

| Directive | Values / Notes |
|-----------|----------------|
| `theme` | `default`, `gaia`, `uncover`, or a registered custom theme name |
| `paginate` | `true`, `false`, `hold`, `skip` |
| `header` | Markdown string shown at the top of every slide |
| `footer` | Markdown string shown at the bottom of every slide |
| `headingDivider` | `1`–`6` — auto-insert slide break before that heading level |
| `style` | Inline CSS applied globally (YAML block scalar `\|`) |
| `lang` | HTML `lang` attribute for accessibility |
| `backgroundColor` | CSS color value for all slide backgrounds |
| `backgroundImage` | CSS `url(...)` value for all slide backgrounds |
| `color` | Default text color for all slides |
| `transition` | Default transition for all slides (see Transitions) |

### Local Directives (Per-Slide)

Local directives set inside `<!-- -->` comments on a slide propagate forward to subsequent slides until overridden.

```markdown
<!-- paginate: true -->
<!-- header: "Section 2" -->
<!-- backgroundColor: #fefefe -->
```

**Spot Directives** — apply only to the current slide (prefix with `_`):

```markdown
<!-- _paginate: false -->
<!-- _class: title -->
<!-- _backgroundColor: #003366 -->
<!-- _color: white -->
```

| Directive | Values |
|-----------|--------|
| `paginate` | `true`, `false`, `hold`, `skip` |
| `header` | Markdown string |
| `footer` | Markdown string |
| `class` | CSS class name(s) for the slide `<section>` |
| `backgroundColor` | CSS color |
| `backgroundImage` | CSS `url(...)` |
| `backgroundPosition` | CSS position (default: `center`) |
| `backgroundRepeat` | CSS repeat (default: `no-repeat`) |
| `backgroundSize` | `cover`, `contain`, `auto`, or percentage |
| `color` | CSS color |
| `transition` | Transition name + optional duration |

### Transitions

Apply via global front-matter or per-slide spot directive.

```yaml
---
transition: fade
---
```

```markdown
<!-- _transition: slide 0.4s -->
```

Available built-in transitions (33 total):
`none`, `clockwise`, `counterclockwise`, `cover`, `coverflow`, `cube`, `cylinder`, `diamond`, `drop`, `explode`, `fade`, `fade-out`, `fall`, `flip`, `glow`, `implode`, `in-out`, `iris-in`, `iris-out`, `melt`, `overlap`, `pivot`, `pull`, `push`, `reveal`, `rotate`, `slide`, `star`, `swap`, `swipe`, `swoosh`, `wipe`, `wiper`, `zoom`

Default duration is `0.5s`. Append duration to override:
```markdown
<!-- _transition: zoom 0.8s -->
```

Custom transitions: define `@keyframes marp-transition-<name>` in CSS.

### Images

**Inline image** (sized within slide content):
```markdown
![w:400px](image.jpg)
![h:200px](image.jpg)
![w:300px h:200px](image.jpg)
```

Size units: `px`, `%`, `cm`, `mm`, `in`, `pt`, `em`, `auto`

**Background image** (covers full slide):
```markdown
![bg](image.jpg)
![bg cover](image.jpg)
![bg contain](image.jpg)
![bg fit](image.jpg)
![bg 80%](image.jpg)
```

**Split background** (half slide, content occupies remaining area):
```markdown
![bg left](image.jpg)
![bg right](image.jpg)
![bg left:40%](image.jpg)
![bg right:33%](image.jpg)
```

**Multiple backgrounds** (stacked horizontally by default):
```markdown
![bg](img1.jpg)
![bg](img2.jpg)
```

**Vertical stack**:
```markdown
![bg vertical](img1.jpg)
![bg vertical](img2.jpg)
```

**CSS filters** (combine freely in alt text):
```markdown
![brightness:1.5](image.jpg)
![blur:5px](image.jpg)
![grayscale:1](image.jpg)
![brightness:.8 sepia:50%](image.jpg)
```

Available filters: `blur`, `brightness`, `contrast`, `drop-shadow`, `grayscale`, `hue-rotate`, `invert`, `opacity`, `saturate`, `sepia`

### Columns / Multi-Column Layouts

MARP has no built-in column directive. Use scoped CSS:

```markdown
<!-- _class: columns -->

<style scoped>
.columns { display: grid; grid-template-columns: 1fr 1fr; gap: 1em; }
</style>

Left column content

---

Right column content (or use HTML div blocks)
```

Alternatively use HTML directly on a slide:

```markdown
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1em">
<div>

Left content (Markdown works inside)

</div>
<div>

Right content

</div>
</div>
```

### Scoped and Global CSS

**Scoped** (current slide only):
```markdown
<style scoped>
h1 { color: crimson; }
</style>
```

**Global** (all slides):
```markdown
<style>
section { font-family: "Helvetica Neue", sans-serif; }
</style>
```

Or put global CSS in the front-matter `style` key.

## Slide Construction Heuristics

- Keep 1 idea per slide.
- Keep headings short and concrete.
- Use `<!-- ... -->` presenter notes for detail, not visible slide body.
- Use spot directives (`_`) to override a single slide without affecting the rest.
- Use `headingDivider` in front-matter when authoring long documents to auto-paginate.
- For dense slides, add `<style scoped> section { font-size: 0.85em; } </style>`.
- Use split backgrounds (`![bg left]`) for text + image layouts.
- Keep transitions consistent across the deck; set globally and override per slide only when intentional.

## Final Validation Checklist

- Front-matter YAML is at file top, valid, and closed with `---`.
- All slides separated by `---` (not `***` or `___`).
- Spot directives use `_` prefix; propagating directives do not.
- No invalid directive spellings.
- Image modifiers are in alt text, not caption or title.
- Fenced code blocks are balanced and have a language specifier.
- HTML `<style scoped>` used for per-slide CSS; global `<style>` for deck-wide rules.
- Presenter notes are HTML comments `<!-- ... -->`, not visible text.
- Transitions are valid names from the supported list or custom-defined.

Version: 1.0.0
