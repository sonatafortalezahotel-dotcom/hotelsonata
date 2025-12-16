# 🎨 Design System - Hotel Sonata de Iracema 2025

**Versão:** 1.0.0  
**Data:** 15/12/2025  
**Status:** ✅ Padrão Profissional 2025

---

## 📐 Sistema de Espaçamento (Spacing Scale)

### Base: 4px (0.25rem)

Todos os espaçamentos seguem uma escala baseada em múltiplos de 4px para consistência visual.

| Nome | Valor | Uso |
|------|-------|-----|
| `space-0` | 0px | Sem espaçamento |
| `space-1` | 4px (0.25rem) | Espaçamento mínimo |
| `space-2` | 8px (0.5rem) | Espaçamento pequeno (gap entre ícones) |
| `space-3` | 12px (0.75rem) | Espaçamento compacto |
| `space-4` | 16px (1rem) | Espaçamento padrão (base) |
| `space-5` | 20px (1.25rem) | Espaçamento médio |
| `space-6` | 24px (1.5rem) | Espaçamento confortável |
| `space-8` | 32px (2rem) | Espaçamento grande |
| `space-10` | 40px (2.5rem) | Espaçamento muito grande |
| `space-12` | 48px (3rem) | Espaçamento extra grande |
| `space-16` | 64px (4rem) | Espaçamento seção |
| `space-20` | 80px (5rem) | Espaçamento seção grande |
| `space-24` | 96px (6rem) | Espaçamento hero |

### Espaçamento Responsivo

**Mobile (< 1024px):**
- Padding seções: `py-12` (48px)
- Gap entre elementos: `gap-4` (16px)
- Margin entre seções: `mb-12` (48px)

**Desktop (≥ 1024px):**
- Padding seções: `py-16 lg:py-24` (64px / 96px)
- Gap entre elementos: `gap-6 lg:gap-8` (24px / 32px)
- Margin entre seções: `mb-16 lg:mb-24` (64px / 96px)

---

## 📦 Container e Padding

### Container Padrão

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Conteúdo */}
</div>
```

**Breakpoints:**
- Mobile: `px-4` (16px)
- Tablet: `sm:px-6` (24px)
- Desktop: `lg:px-8` (32px)

**Max-width:**
- Mobile: 100%
- Tablet: 640px
- Desktop: 1280px
- Large: 1600px

---

## 🎯 Componentes Padrão

### Seções

```tsx
<section className="py-12 lg:py-16 lg:py-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Conteúdo */}
  </div>
</section>
```

### Cards

```tsx
<div className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
  {/* Conteúdo */}
</div>
```

**Padding:**
- Mobile: `p-6` (24px)
- Desktop: `lg:p-8` (32px)

**Border Radius:**
- Padrão: `rounded-lg` (0.5rem)
- Grande: `rounded-xl` (0.75rem)
- Extra Grande: `rounded-2xl` (1rem)

### Formulários

```tsx
<div className="space-y-6">
  <div className="space-y-2">
    <Label>Campo</Label>
    <Input />
  </div>
</div>
```

**Espaçamento entre campos:**
- Mobile: `space-y-4` (16px)
- Desktop: `space-y-6` (24px)

**Espaçamento label + input:**
- `space-y-2` (8px)

### Grids

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {/* Itens */}
</div>
```

**Gaps:**
- Mobile: `gap-4` (16px)
- Desktop: `gap-6` (24px)
- Large: `lg:gap-8` (32px)

---

## 🎨 Cores

### Cores Primárias

```css
--primary: #1B364B (Azul escuro)
--secondary: #E65837 (Coral/Laranja)
```

### Uso de Cores

- **Primary:** Botões principais, links, destaques
- **Secondary:** CTAs, ações importantes
- **Muted:** Fundos, textos secundários
- **Accent:** Hover states, elementos interativos

---

## 📝 Tipografia

### Hierarquia

| Elemento | Mobile | Desktop | Peso |
|----------|--------|---------|------|
| H1 | `text-3xl` | `lg:text-4xl` | `font-bold` |
| H2 | `text-2xl` | `lg:text-3xl` | `font-bold` |
| H3 | `text-xl` | `lg:text-2xl` | `font-semibold` |
| H4 | `text-lg` | `lg:text-xl` | `font-semibold` |
| Body | `text-base` | `lg:text-lg` | `font-normal` |
| Small | `text-sm` | `lg:text-base` | `font-normal` |

### Espaçamento de Texto

- **Line Height:** `leading-relaxed` (1.625) para parágrafos
- **Line Height:** `leading-normal` (1.5) para títulos
- **Letter Spacing:** Padrão (sem tracking)

---

## 🔘 Botões

### Tamanhos

```tsx
// Pequeno
<Button size="sm" className="h-9 px-4">

// Médio (padrão)
<Button size="default" className="h-10 px-6">

// Grande
<Button size="lg" className="h-12 px-8">

// Extra Grande (CTAs)
<Button size="lg" className="h-14 px-10 text-base">
```

### Espaçamento Interno

- Horizontal: `px-4` a `px-10` (conforme tamanho)
- Vertical: `h-9` a `h-14` (conforme tamanho)
- Gap ícone + texto: `gap-2` (8px)

---

## 📱 Breakpoints

| Nome | Valor | Uso |
|------|-------|-----|
| `sm` | 640px | Mobile grande |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop grande |
| `2xl` | 1600px | Desktop extra grande |

---

## 🎭 Estados de Interação

### Hover

```tsx
className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
```

### Focus

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
```

### Active

```tsx
className="active:scale-95"
```

### Disabled

```tsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

---

## 🔄 Transições

### Duração

- Rápida: `duration-150` (150ms)
- Padrão: `duration-200` (200ms)
- Suave: `duration-300` (300ms)
- Lenta: `duration-500` (500ms)

### Easing

- Padrão: `ease-in-out`
- Entrada: `ease-out`
- Saída: `ease-in`

---

## 📐 Z-Index Scale

| Camada | Valor | Uso |
|--------|-------|-----|
| Base | 0 | Conteúdo normal |
| Dropdown | 10 | Dropdowns |
| Sticky | 20 | Elementos sticky |
| Fixed | 30 | Elementos fixos |
| Overlay | 40 | Overlays |
| Modal | 50 | Modais, dialogs |
| Popover | 50 | Popovers |
| Tooltip | 60 | Tooltips |
| Toast | 70 | Notificações |

---

## ✅ Checklist de Implementação

### Ao criar um novo componente:

- [ ] Usa container padrão (`container mx-auto px-4 sm:px-6 lg:px-8`)
- [ ] Espaçamento vertical responsivo (`py-12 lg:py-16 lg:py-24`)
- [ ] Gaps consistentes (`gap-4 lg:gap-6`)
- [ ] Padding interno adequado (`p-6 lg:p-8`)
- [ ] Border radius consistente (`rounded-lg`, `rounded-xl`, `rounded-2xl`)
- [ ] Transições suaves (`transition-all duration-200`)
- [ ] Estados de hover/focus/active
- [ ] Responsivo mobile-first
- [ ] Acessibilidade (aria-labels, keyboard navigation)
- [ ] Dark mode compatível

---

## 🚫 Erros Comuns a Evitar

1. ❌ **Espaçamentos hardcoded** - Use a escala padrão
2. ❌ **Padding inconsistente** - Sempre use múltiplos de 4px
3. ❌ **Gaps muito pequenos** - Mínimo `gap-4` (16px)
4. ❌ **Sobreposição de elementos** - Verifique z-index
5. ❌ **Container sem padding** - Sempre adicione padding responsivo
6. ❌ **Breakpoints inconsistentes** - Use apenas os definidos
7. ❌ **Sem estados de interação** - Sempre adicione hover/focus

---

## 📚 Referências

- [Tailwind CSS Spacing](https://tailwindcss.com/docs/customizing-spacing)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Material Design Spacing](https://material.io/design/layout/spacing-methods.html)
- [8-Point Grid System](https://spec.fm/specifics/8-pt-grid)

---

*Documento mantido atualizado conforme melhores práticas de UI/UX 2025*

