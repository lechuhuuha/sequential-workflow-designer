import { Step } from '../../definition';
import { StepExtension } from '../../designer-extension';
import { createLargeTaskStepComponentViewFactory } from './large-task-step-component-view';
import { LargeTaskStepExtensionConfiguration } from './large-task-step-extension-configuration';

const defaultConfiguration: LargeTaskStepExtensionConfiguration = {
	view: {
		textMarginLeft: 12,
		minTextWidth: 140,
		nameY: 22,
		descriptionY: 44,
		paddingLeft: 12,
		paddingRight: 12,
		paddingY: 12,
		circleSize: 40,
		iconSize: 22,
		inputSize: 14,
		outputSize: 10
	}
};

const Pe = (t: Step) => `Task type: ${t.type}`,
	Fe = {
		textMarginLeft: 12,
		minTextWidth: 140,
		nameY: 22,
		descriptionY: 44,
		paddingLeft: 12,
		paddingRight: 12,
		paddingY: 12,
		circleSize: 40,
		iconSize: 22,
		inputSize: 14,
		outputSize: 10,
	};
const Me = { view: Fe, descriptionProvider: Pe };

export class LargeTaskStepExtension implements StepExtension<Step> {
	public static create(configuration?: LargeTaskStepExtensionConfiguration): LargeTaskStepExtension {
		return new LargeTaskStepExtension(configuration ? defaultConfiguration : Me);
	}

	public readonly componentType = 'largeTask';

	private constructor(private readonly configuration: LargeTaskStepExtensionConfiguration) {

	}

	public readonly createComponentView = createLargeTaskStepComponentViewFactory(this.configuration.view);
	// getChildren() {
	// 	return null;
	// }
}
