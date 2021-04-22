import { autobind as Autobind } from "../decorators/autobind";
import { DragTarget } from "../models/DragTarget";
import { ProjectStatus } from "../models/ProjectStatus";
import { Project } from "../models/Project";
import { Component } from "./Component";
import { ProjectItem } from "./ProjectItem";
import { ProjectState } from "../state/ProjectState";

// ProjectList class
export class ProjectList extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget {
    assignedProjects: Project[];
    projectState: ProjectState;

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);
        this.assignedProjects = [];
        this.projectState = ProjectState.getInstance();

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer?.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @Autobind
    dropHandler(event: DragEvent) {
        const projectId = event.dataTransfer!.getData('text/plain');
        this.projectState.moveProject(
            projectId,
            this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    @Autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        this.projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(p => this.type === 'active'
                ? p.status === ProjectStatus.Active
                : p.status === ProjectStatus.Finished);

            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;

        listEl.innerHTML = '';

        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
        }
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    }
}
