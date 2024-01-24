/* global document, sequentialWorkflowDesigner, console */

function createIfStep(id, name, type, _true, _false) {
	return {
		id,
		componentType: 'switch',
		type: 'if',
		name: name,
		branches: {
			yes: _true,
			no: _false
		},
		properties: {
			draggable: true,
			type: type
		}
	};
}

function createComponent(id, type, name, properties) {
	properties = Object.assign(
		{
			draggable: true,
			deletable: true,
			type: type
		},
		properties
	);
	if (type === 'trigger') {
		properties.draggable = false;
		properties.deletable = true;
		switch (name) {
			case 'Welcome new subscriber':
				type = 'welcome-new-subscriber';
				break;
			case 'Say goodbye to subscriber':
				type = 'say-goodbye-subscriber';
				break;
			case 'Say happy birthday':
				type = 'say-happy-birthday';
				break;
			case 'Subscriber added date':
				type = 'subscriber-added-date';
				break;
			case 'Specific date':
				type = 'specific-date';
				break;
			case 'Specific date chosen':
				type = 'specific-date-chosen';
				break;
			case 'API 3.0':
				type = 'api-3-0';
				break;
			case 'Weekly recurring':
				type = 'weekly-recurring';
				break;
			case 'Monthly recurring':
				type = 'monthly-recurring';
				break;
			default:
				break;
		}
	}
	if (type === 'action') {
		switch (name) {
			case 'Send email':
				type = 'send-mail';
				break;
			case 'Wait':
				type = 'wait';
				break;
			case 'Open email ?':
				type = 'open-email';
				break;
			case 'Clicked email ?':
				type = 'clicked-email';
				break;
			case 'Update subscriber field':
				type = 'update-subscriber-field';
				break;
			case 'Add tag':
				type = 'add-tag';
				break;
			case 'Clone subscriber':
				type = 'clone-subscriber';
				break;
			default:
				break;
		}
	}
	return { id: id, componentType: 'largeTask', type: type, name: name, properties: properties || {} };
}

// Toolbox group creation function
function toolboxGroup(name, steps) {
	return {
		name,
		steps
	};
}

// Create the toolbox
const groups = [
	toolboxGroup('Trigger', [
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'Welcome new subscriber'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'Say goodbye to subscriber'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'Say happy birthday'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'Subscriber added date'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'Specific date'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'Specific date chosen'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'API 3.0'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'Weekly recurring'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'trigger', 'Monthly recurring')
	]),
	toolboxGroup('Action', [
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'action', 'Send email'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'action', 'Wait'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'action', 'Update subscriber field'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'action', 'Add tag'),
		createComponent(sequentialWorkflowDesigner.Uid.next(), 'action', 'Clone subscriber')
	]),
	toolboxGroup('Condition', [
		createIfStep(sequentialWorkflowDesigner.Uid.next(), 'Open email ?', 'condition', [], []),
		createIfStep(sequentialWorkflowDesigner.Uid.next(), 'Clicked email ?', 'condition', [], [])
	])
];
function reloadChangeReadonlyButtonText() {
	changeReadonlyButton.innerText = 'Readonly: ' + (designer.isReadonly() ? 'ON' : 'OFF');
}

function appendCheckbox(root, label, isChecked, onClick) {
	const item = document.createElement('div');
	item.innerHTML = '<div><h5></h5> <input type="checkbox" /></div>';
	const h5 = item.getElementsByTagName('h5')[0];
	h5.innerText = label;
	const input = item.getElementsByTagName('input')[0];
	input.checked = isChecked;
	input.addEventListener('click', () => {
		onClick(input.checked);
	});
	root.appendChild(item);
}

let designer;
let changeReadonlyButton;
let validationStatusText;

function refreshValidationStatus() {
	validationStatusText.innerText = designer.isValid() ? 'Definition is valid' : 'Definition is invalid';
}
function isSequenceMatching(sequence) {
	return designer.getDefinition().sequence === sequence;
}

class InitConfig {
	constructor(t) {
		this.configuration = t;
	}
	create() {
		return this.configuration;
	}
}
class CanCreateComponent {
	static create(t) {
		const e = new InitConfig(t);
		return new CanCreateComponent(e);
	}
	constructor(t) {
		this.placeholderController = t;
	}
}
function isInterruptingComponent(t) {
	return ['interruptingIcon', 'interruptingTask'].includes(t.componentType);
}

function serializeStepParents(parents) {
	return '/' + parents.map(s => (Array.isArray(s) ? 'sequence' : s.name)).join('/');
}

function isTriggerStep(type) {
	if (type == 'trigger') {
		return true;
	}
	return false;
}

function isStartPosition(index) {
	if (index == 0) {
		return true;
	}
	return false;
}

const configuration = {
	undoStackSize: null,
	theme: 'light',
	toolbox: {
		groups: groups
	},
	steps: {
		iconUrlProvider: (componentType, type) => {
			return `./assets/icon-${type}.svg`;
		},
		isDraggable: step => {
			return step.properties.draggable;
		},
		canMoveStep: (parentSourceSequence, step, targetSequence, targetIndex) => {
			const isTriggerStep = step.properties.type === 'trigger';

			const isTreeEmpty = designer.getDefinition().sequence.length === 0;
			// if tree is empty then only trigger type can insert
			if (isTreeEmpty) {
				if (isTriggerStep) {
					return true;
				} else {
					return false;
				}
			}
			const isTriggerExists = designer.getDefinition().sequence.some(obj => obj.properties.type === 'trigger');

			// try to insert step that is not trigger in trigger position
			if (isTriggerExists && targetSequence.length > 0 && targetIndex === 0) {
				return false;
			}

			if (isTriggerStep && isTriggerExists) {
				console.log('isTriggerExists', isTriggerExists, 'isTriggerStep', isTriggerStep);

				return false;
			}

			// action in switch step
			if (!isTreeEmpty && targetSequence.length === 0) {
				return true;
			}

			return true;
		},
		canInsertStep: (step, targetSequence, targetIndex) => {
			const isTriggerStep = step.properties.type === 'trigger';

			const isTreeEmpty = designer.getDefinition().sequence.length === 0;
			// if tree is empty then only trigger type can insert
			if (isTreeEmpty) {
				if (isTriggerStep) {
					return true;
				} else {
					return false;
				}
			}
			const isTriggerExists = designer.getDefinition().sequence.some(obj => obj.properties.type === 'trigger');

			// try to insert step that is not trigger in trigger position
			if (isTriggerExists && targetSequence.length > 0 && targetIndex === 0) {
				return false;
			}

			if (isTriggerStep && isTriggerExists) {
				console.log('isTriggerExists', isTriggerExists, 'isTriggerStep', isTriggerStep);

				return false;
			}

			// action in switch step
			if (!isTreeEmpty && targetSequence.length === 0) {
				return true;
			}

			return true;
		}
	},

	validator: {
		step: step => {
			return !step.properties['isInvalid'];
		}
	},

	editors: {
		isCollapsed: false, // or false
		globalEditorProvider: definition => {
			const root = document.createElement('div');
			root.innerHTML = '<textarea style="width: 100%; border: 0;" rows="50"></textarea>';
			const textarea = root.getElementsByTagName('textarea')[0];
			textarea.value = JSON.stringify(definition, null, 2);
			const callback = () => {
				console.log('Callback invoked');
			};
			return [root, callback];
		},

		stepEditorProvider: (step, editorContext) => {
			// Find the div element
			var divElement = document.querySelector('.sqd-smart-editor-toggle.sqd-collapsed');

			// Perform the click action
			if (divElement) {
				divElement.click();
			}
			const root = document.createElement('div');
			// console.log(step.properties)
			console.log(editorContext.notifyPropertiesChanged());
			return root;
		}
	},
	controlBar: true,

	extensions: [
		CanCreateComponent.create({
			canCreate: (sequence, index) => {
				// console.log(index);

				// if (sequence[index]) {
				// 	console.log('sequence,index', sequence[index]);
				// 	console.log(index);
				// }
				return true;
				if (sequence.length === 0) {
					return true;
				}

				if (isSequenceMatching(sequence) && (index === 0 || index === sequence.length)) {
					return false;
				}

				if (index === 0 && sequence.length === 1 && isInterruptingComponent(sequence[0])) {
					return true;
				}

				for (let i = 0; i < index; i++) {
					if (isInterruptingComponent(sequence[i])) {
						return false;
					}
				}

				return index !== 0;
			}
		})
	]
};

const startDefinition = {
	properties: {},
	sequence: []
};

function processBranches(branches, modifiedArray) {
	branches.forEach((element, index) => {
		const modifiedElement = {
			...element
		};
		const childIndex = `${index + 1}`;

		if (branches[childIndex]) {
			modifiedElement.child = branches[childIndex].id;
		}

		if (modifiedElement.componentType === 'switch') {
			if (modifiedElement.branches.yes.length > 0) {
				modifiedElement.childYes = modifiedElement.branches.yes[0].id;
			}
			if (modifiedElement.branches.no.length > 0) {
				modifiedElement.childNo = modifiedElement.branches.no[0].id;
			}
		}

		modifiedArray.push(modifiedElement);

		if (modifiedElement.componentType === 'switch') {
			const yesBranch = modifiedElement.branches.yes;
			const noBranch = modifiedElement.branches.no;

			if (yesBranch.length > 0) {
				processBranches(yesBranch, modifiedArray);
			}
			if (noBranch.length > 0) {
				processBranches(noBranch, modifiedArray);
			}
		}
	});
}

fetch('http://base.zema.de/test-html')
	.then(response => response.json())
	.then(data => {
		// Assign the decoded response value to the `sequence` variable
		startDefinition.sequence = data;
		const modifiedArray = [];
		console.log('data', data);
		// Use the updated `startDefinition` object as needed
		// console.log(startDefinition);
		processBranches(data, modifiedArray);
		// console.log(JSON.stringify(modifiedArray, null, 2));
		console.log('modifiedArray', modifiedArray);
		const placeholder = document.getElementById('designer');
		designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);

		designer.onDefinitionChanged.subscribe(newDefinition => {
			console.log('newDefinition', newDefinition);
			refreshValidationStatus();
			if (!newDefinition && !newDefinition.sequence) {
				return;
			}

			const modifiedArray = [];
			processBranches(newDefinition.sequence, modifiedArray);

			var propertiesArray = [];

			for (var i = 0; i < modifiedArray.length; i++) {
				var element = modifiedArray[i];
				var properties = element.properties.element;
				propertiesArray.push(properties);
			}

			console.log(JSON.stringify(propertiesArray, null, 2));
		});

		changeReadonlyButton = document.getElementById('changeReadonlyButton');
		changeReadonlyButton.addEventListener('click', () => {
			designer.setIsReadonly(!designer.isReadonly());
			reloadChangeReadonlyButtonText();
		});
		reloadChangeReadonlyButtonText();

		validationStatusText = document.getElementById('validationStatus');
		refreshValidationStatus();
	})
	.catch(error => {
		console.error('Error:', error);
	});
