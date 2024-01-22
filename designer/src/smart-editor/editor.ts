import { Step } from '../definition';
import { DesignerApi } from '../api/designer-api';
import { EditorRenderer } from '../api/editor-renderer';
import { EditorView } from './editor-view';
import { GlobalEditorProvider, StepEditorProvider } from '../designer-configuration';

export class Editor {
	public static create(
		parent: HTMLElement,
		api: DesignerApi,
		stepEditorClassName: string,
		stepEditorProvider: StepEditorProvider,
		globalEditorClassName: string,
		globalEditorProvider: GlobalEditorProvider
	): Editor {
		const view = EditorView.create(parent);

		function render(step: Step | null) {
			let content: HTMLElement;
			let className: string;
			let callBack: (() => void) | undefined;
			if (step) {
				const stepContext = api.editor.createStepEditorContext(step.id);
				[content,callBack] = stepEditorProvider(step, stepContext);
				className = stepEditorClassName;
			} else {
				const globalContext = api.editor.createGlobalEditorContext();
				[content,callBack] = globalEditorProvider(api.editor.getDefinition(), globalContext);
				className = globalEditorClassName;
			}
			view.setContent(content, className);
			// Check if the callBack is defined and callable, then invoke it
			if (typeof callBack === 'function') {
				callBack();
			}
		}

		const renderer = api.editor.runRenderer(step => render(step));
		return new Editor(view, renderer);
	}

	private constructor(private readonly view: EditorView, private readonly renderer: EditorRenderer) {}

	public destroy() {
		this.view.destroy();
		this.renderer.destroy();
	}
}
