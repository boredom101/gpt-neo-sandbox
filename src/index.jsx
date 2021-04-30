import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from "axios";
import config from './config/sandbox.json';
import template from './config/template.txt';

class OutputView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: props.mode
    }
  }
  render() {
    return <div className="output-view">
      {this.props.text}
    </div>
  }
}

class InputView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: props.mode,
      input: ""
    };
    this.process = this.process.bind(this);
    this.change = this.change.bind(this);
  }
  process(e) {
    this.props.onSubmit(this.state.input);
  }
  change(e) {
    this.setState({input: e.target.value})
  }
  render() {
    if (this.state.mode === "multiline") {
      return <div className="input-view">
        <textarea placeholder={this.props.prompt} onChange={this.change} className="input-element"></textarea>
        <br/>
        <button disabled={this.props.processing} onClick={this.process}>Process</button>
      </div>;
    } else if (this.state.mode === "singleline") {
      return <div className="input-view">
        <input placeholder={this.props.prompt} onChange={this.change} type="text" className="input-element"></input>
        <br/>
        <button disabled={this.props.processing} onClick={this.process}>Process</button>
      </div>;
    }
  }
}

class Sandbox extends React.Component {
  render() {
    return (
      <div className="app-view">
        <h2>{this.props.title}</h2>
        <br></br>
        <InputView processing={this.state.processing} mode={this.state.inputMode}
         onSubmit={this.submit} prompt={this.props.prompt}></InputView>
        <br></br>
        <OutputView mode={this.state.outputMode} text={this.state.text}></OutputView>
      </div>
    );
  }
  submit(text) {
    var params = {};
    if (this.props.temperature) {
      params.temperature = this.props.temperature;
    }
    if (this.props.penalty) {
      params.repetition_penalty = this.props.penalty;
    }
    const temp = {
      inputs: this.props.template.replace("{input}", text),
      parameters: params
    };
    this.state.backend.post(this.props.model, temp).then(
      (response) => {
        const temp = response.data[0]["generated_text"];
        const offset = config.output.offset + (config.output.plus ? text.length : 0);
        this.setState({text: temp.substring(offset)});
        this.setState({processing: false});
      }
    );
    this.setState({processing: true});
  }
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      text: "",
      outputMode: props.outputMode,
      inputMode: props.inputMode,
      backend: axios.create({
        baseURL: "https://api-inference.huggingface.co/models/EleutherAI/",
        headers: {"Autherization": "Bearer " + this.props.token}
      }),
    };
    this.submit = this.submit.bind(this);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Sandbox title={config.title} template={template} model={config.backend.model}
     inputMode={config.input.mode} token={process.env.SANDBOX_TOKEN} prompt={config.input.prompt}
     temperature={config.backend.temperature} penalty={config.backend.penalty}/>
  </React.StrictMode>,
  document.getElementById('root')
);