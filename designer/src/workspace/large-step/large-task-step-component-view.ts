import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { Step } from '../../definition';
import { StepComponentViewContext, StepComponentViewFactory, StepContext } from '../../designer-extension';
import { InputView } from '../common-views/input-view';
import { OutputView } from '../common-views/output-view';
import { StepComponentView } from '../component';
import { LargeTaskStepComponentViewConfiguration } from './large-task-step-component-view-configuration';

const Pe = (t: Step) => {

	let type = t.properties.type != null ? String(t.properties.type).toUpperCase() : null;
	return type;
}

const crop = (text: SVGTextElement, maxSize: number) => {
	while (text.getComputedTextLength() > maxSize) {
		text.textContent = text.textContent?.slice(0, -4)?.trim() + "...";
	}
};

export const createLargeTaskStepComponentViewFactory =
	(cfg: LargeTaskStepComponentViewConfiguration): StepComponentViewFactory =>
		(parentElement: SVGElement, stepContext: StepContext<Step>, viewContext: StepComponentViewContext): StepComponentView => {
			const r = Dom.svg("g");
			parentElement.appendChild(r);

			const a =
				cfg.paddingLeft +
				cfg.circleSize +
				cfg.textMarginLeft,
				d = Dom.svg("text", {
					class: "sqd-large-task-name-text",
					x: a,
					y: cfg.nameY,
				});
			(d.textContent = stepContext.step.name), r.appendChild(d);
			crop(d, 220 - 70); // Crop the text content
			const l = d.getBBox(),
				c = Dom.svg("text", {
					class: "sqd-large-task-description-text",
					x: a,
					y: cfg.descriptionY,
				});
			(c.textContent = Pe(stepContext.step)), r.appendChild(c);

			const p = c.getBBox(),
				u = Dom.svg('circle', {
					class: 'sqd-large-task-circle',
					cx: cfg.paddingLeft + cfg.circleSize / 2,
					cy: cfg.paddingY + cfg.circleSize / 2,
					r: cfg.circleSize / 2
				});
			r.appendChild(u);

			var g = Math.max(l.width, p.width, cfg.minTextWidth),
				m = cfg.circleSize + g + cfg.paddingLeft + cfg.paddingRight + cfg.textMarginLeft,
				v = cfg.circleSize + 2 * cfg.paddingY,
				C = viewContext.getStepIconUrl();
			if (C) {
				const e = Dom.svg("image", {
					href: C,
					width: cfg.iconSize,
					height: cfg.iconSize,
					x:
						cfg.paddingLeft +
						cfg.circleSize / 2 -
						cfg.iconSize / 2,
					y:
						cfg.paddingY +
						cfg.circleSize / 2 -
						cfg.iconSize / 2,
				});
				r.appendChild(e);
			}

			const f = InputView.createRoundInput(r, m / 2, 0, cfg.inputSize),
				w = OutputView.create(r, m / 2, v, cfg.outputSize),
				q = Dom.svg("rect", {
					class: "sqd-large-task-rect",
					x: 0.5,
					y: 0.5,
					width: m,
					height: v,
					rx: 4,
					ry: 4,
				});

			return (
				r.insertBefore(q, d),
				{
					g: r,
					width: m,
					height: v,
					joinX: m / 2,
					placeholders: null,
					sequenceComponents: null,
					resolveClick(t) {
						return !!this.g.contains(t.element) || null;
					},
					setIsSelected(t) {
						Dom.toggleClass(q, t, "sqd-selected");
					},
					setIsDisabled(t) {
						Dom.toggleClass(r, t, "sqd-disabled");
					},
					getClientPosition() {
						const t = r.getBoundingClientRect();
						return new Vector(t.x, t.y);
					},
					setIsDragging(t) {
						f.setIsHidden(t), w.setIsHidden(t);
					},
					hasOutput: () => !0,
				}
			);
		};
