import { State, printState, saveState } from "./stores";

export function handleKeyPress(event) {
    // l -> log state
    if (event.charCode === 108) {
        printState();
    }
    // s -> save
    if (event.charCode === 115) {
        saveState();
    }
    // t -> temp function
    if (event.charCode === 116) {
        const widgets = {
            many: {},
            one: {
                'Summary': {
                    name: 'Summary',
                    width: '4cols',
                    height: 250,
                    template: `
                        <style> .row{ display:flex } .title{ font-weight:bold } </style>
                        <div>
                            <div class="row">
                                <div class="title">
                                    Name
                                </div>
                                <div>
                                    {{Name}}
                                </div>
                            </div>                        
                            <div class="row">
                                <div class="title">
                                    Oracle Text
                                </div>
                                <div>
                                    {{Oracle Text}}
                                </div>
                            </div>
                        </div>
                    `,
                },
                'Image': {
                    name: 'Image',
                    width: '488px',
                    height: 680,
                    template: `
                        <div>
                            <img src="{{Image}}" />
                        </div>
                    `,
                }
            }
        }
        State.setWidgets('cards', widgets);
    }
    
}
