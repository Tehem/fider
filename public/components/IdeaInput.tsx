import axios from "axios";
import * as React from "react";
import { getCurrentUser } from "../storage";
import { SocialSignInButton } from "./SocialSignInButton";

interface IdeaInputState {
    title: string;
    clicked: boolean;
}

export class IdeaInput extends React.Component<{}, IdeaInputState> {
    private description: HTMLTextAreaElement;

    constructor() {
        super();
        this.state = {
          title: "",
          clicked: false
        };
    }

    public async submit() {
      this.setState({ clicked: true });

      const response = await axios.post("/api/ideas", {
        title: this.state.title,
        description: this.description.value
      });

      location.reload();
    }

    public render() {
        const user = getCurrentUser();
        const buttonClasses = `ui positive button ${this.state.clicked && "loading disabled"}`;
        const details = user ?
                        <div>
                          <div className="field">
                            <textarea ref={(ref) => this.description = ref }
                                      rows={6}
                                      placeholder="Describe your idea (optional)"></textarea>
                            </div>
                              <button className={buttonClasses} onClick={async () => { await this.submit(); } }>
                                Submit Idea
                              </button>
                            </div> :
                          <div>
                          <div className="ui message">
                            <div className="header">
                              Please log in before posting an idea
                            </div>
                            <p>This only takes a second and you'll be good to go!</p>
                            <SocialSignInButton provider="facebook" small={true} />
                            <SocialSignInButton provider="google" small={true} />
                          </div>
                        </div>;

        return <div className="ui form">
                <div className="ui fluid input">
                    <input  id="new-idea-input"
                            type="text"
                            maxLength={100}
                            onKeyUp={(e) => { this.setState({ title: e.currentTarget.value }); }}
                            placeholder="Enter your idea, new feature or suggestion here ..." />
                </div>

                { this.state.title.length > 0 && details }
               </div>;
    }
}
