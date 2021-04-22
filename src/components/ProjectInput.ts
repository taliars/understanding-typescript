import { autobind as Autobind } from "../decorators/autobind";
import { Validatable, validate } from "../utils/Validation";
import { Component } from "./Component";
import { ProjectState } from "../state/ProjectState";

// Project Input class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    // input elements
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.titleInputElement = this.getInputElement('#title');
        this.descriptionInputElement = this.getInputElement('#description');
        this.peopleInputElement = this.getInputElement('#people');

        this.configure();
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent() {
    }

    private getInputElement = (selector: string) => this.element.querySelector(selector) as HTMLInputElement;

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();

        const userInput = this.gatherUserInput();

        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            ProjectState.getInstance().addProject(title, description, people);
            this.clearInputs();
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidable: Validatable = {
            value: enteredTitle,
            required: true
        };

        const descriptionValidable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };

        const peopleValidable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (!validate(titleValidable) ||
            !validate(descriptionValidable) ||
            !validate(peopleValidable)) {
            alert('Invalid input, please try again!');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
}
