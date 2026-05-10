# QiuQiuTech Design System V1

## 1. Design Direction

QiuQiuTech should combine:

- editorial clarity
- product-grade structure
- restrained motion
- premium information density

It should not feel like:

- a generic template landing page
- a flashy animation demo
- a cold enterprise dashboard
- a noisy portal

## 2. Brand Interpretation

Based on the provided logo, the visual identity should communicate:

- trust and professionalism
- content agility
- opportunity and discovery

## 3. Color Strategy

### Core Palette

- Primary Navy: for titles, navigation, key text, and trusted product surfaces
- Teal: for category accents, informational labels, and lighter brand moments
- Signal Yellow: for highlight states, opportunity emphasis, and key action cues

### Supporting Neutrals

- White / Off-white backgrounds
- Soft gray borders
- Dark neutral body text
- Mid-gray secondary text

### Usage Rules

- White and navy should dominate the interface
- Teal should support rhythm, not dominate the page
- Yellow should remain rare and intentional
- Avoid broad purple/blue gradient themes
- Avoid beige or monochrome brown editorial palettes

## 4. Typography

### Tone

- modern
- rational
- premium
- highly legible

### Recommendation

- Chinese: Source Han Sans / HarmonyOS Sans style direction
- Latin and numerals: Inter / Geist style direction

### Rules

- strong hierarchy between headline, section title, metadata, and tags
- tighter tracking for large English display headlines
- avoid oversized decorative headlines in content-dense sections

## 5. Layout Principles

- content platform first, marketing page second
- wide content bands, not nested floating cards
- clear left-right scanning structure
- stable card ratios for repeated modules
- consistent gutters and vertical rhythm

## 6. Card System

### Card Families

- editorial feature card
- compact content card
- case card
- playbook card
- opportunity card
- metric card
- admin table row card

### Card Rules

- border radius around 8px
- subtle shadows only when needed
- visible borders on light backgrounds
- consistent media aspect ratios
- no oversized colored icon tiles

## 7. Motion Rules

Motion should only do two things:

- clarify hierarchy
- increase polish

### Appropriate Motion

- fade/slide-in for section reveal
- number count-up on metrics
- subtle hover elevation
- filter transition
- step transition in submission forms

### Avoid

- constant floating motion
- heavy parallax
- noisy particle backgrounds
- aggressive 3D effects
- motion that competes with reading

## 8. Homepage Visual Tone

The homepage should feel like a mature platform surface:

- one strong hero band
- clean content hierarchy
- a balance of large feature blocks and dense information blocks
- selective emphasis on opportunities and trends

It should read as:

**there is valuable content here, and there are real industry opportunities here**

## 9. Frontend Component Direction

Recommended component base:

- shadcn/ui for foundations
- select animated or expressive pieces inspired by React Bits / Magic UI
- optional curated modules inspired by Aceternity UI or 21st.dev

Use animations as accents rather than page structure.

## 10. Backend/Admin Direction

The admin should optimize operational efficiency:

- light surfaces
- clear tables
- sharp status design
- dense but legible controls
- predictable flows

It should visually align with the brand, but not mimic the editorial front page.

## 11. Logo Usage Guidance

- Keep generous whitespace around the logo
- Prefer navy typography on light backgrounds
- Use the icon carefully as a brand marker rather than a repeated decorative motif
- Avoid placing the full logo on noisy or highly textured backgrounds

## 12. Design Standard Summary

QiuQiuTech's minimum design bar should be:

- premium
- clean
- structured
- content-led
- data-aware
- credible enough for industry users

## 13. Shadow System — 风格 A：深色投影浮起（iOS 卡片感）

> 新增于 2026-05-09。本项目统一采用此阴影系统，所有页面和组件必须遵循。

### 设计原则

- 双层阴影结构：**近景浅层**（聚焦）+ **远景深层**（泛光）
- 颜色基准统一为 `rgba(18, 36, 96)` — 与 Navy 色 `--navy` 的 RGB 值完全对齐
- opacity 整体提升，阴影更明显，有浮起感
- 彩色按钮保留色系，只更新结构阴影

### Token 定义（globals.css）

```css
--shadow-sm: 0 1px 3px rgba(18, 36, 96, 0.10), 0 4px 12px rgba(18, 36, 96, 0.06);
--shadow-md: 0 2px 8px rgba(18, 36, 96, 0.12), 0 8px 24px rgba(18, 36, 96, 0.08);
--shadow-lg: 0 4px 16px rgba(18, 36, 96, 0.14), 0 16px 48px rgba(18, 36, 96, 0.10);
--shadow-xl: 0 8px 32px rgba(18, 36, 96, 0.16), 0 24px 72px rgba(18, 36, 96, 0.12);
```

### Tailwind 工具类映射

`@theme inline` 已注册 shadow-sm/md/lg/xl，Tailwind `shadow-*` 类可直接使用。

### 应用范围（已更新 18+ 文件）

| 层级 | Token | 典型场景 |
|------|-------|---------|
| 微型 | `--shadow-sm` | 标签、徽章、内联元素 |
| 基础 | `--shadow-md` | 按钮、输入框、小卡片 |
| 标准 | `--shadow-lg` | 内容卡片、模态框 |
| 大型 | `--shadow-xl` | Hero 区域、浮层面板 |

### 禁止事项

- ❌ 不得在 globals.css 以外直接写任意值阴影（如 `shadow-[0_2px_8px_rgba(...)]`），除非是临时调试
- ❌ 不得混用旧阴影值（`rgba(22, 43, 117)` 等）
- ❌ 彩色按钮不得改色，只能更新阴影结构
- ✅ 所有新阴影统一走 `--shadow-*` token

### 相关文件

- `web/src/app/globals.css` — shadow token + `@theme inline` 注册
- `web/src/components/ui/button.tsx` — primary/destructive/teal 变体
- `web/src/components/layout/site-shell.tsx` — header/footer/CTA 按钮
- 15+ page 文件：home / contents / submit / admin / playbooks / requests / search / rankings / me / events / topics 等
- 10+ 组件：home-hero-carousel / platform-ui / auth-modal / marketing-heat-trend-card 等
