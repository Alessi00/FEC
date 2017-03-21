const React = require('react');
const URI = require('urijs');
const $ = require('jquery');
const Checkbox = require('./Checkbox');

class CitationFilter extends React.Component {
    constructor(props) {
      super(props);
      this.state = { citations: [], dropdownVisible: false, currentValue: '' }
      this.interceptChange = this.interceptChange.bind(this);
      this.setSelection = this.setSelection.bind(this);
      this.dropdownDisplay = this.dropdownDisplay.bind(this);
      this.hideDropdown = this.hideDropdown.bind(this);
    }

    interceptChange(e) {
        if(e.target.value) {
          const path = URI(window.API_LOCATION)
                      .path([window.API_VERSION, 'legal', 'citation', this.props.citationType, e.target.value].join('/'))
                      .addQuery('api_key', window.API_KEY);
          $.getJSON(path.toString(), (result) => {
            this.setState({citations: result.citations, dropdownVisible: true});
          });
        } else {
          this.setState({citations: [], dropdownVisible: false});
        }

        this.setState({currentValue: e.target.value});
    }

    setSelection(citation) {
      const citationTags = this.props.value || [];
      citationTags.push(citation)
      const syntheticEvent = { target: {name: this.props.name, value: citationTags } };
      this.props.instantQuery(syntheticEvent);
      this.setState({dropdownVisible: false, currentValue: ''});
    }

    dropdownDisplay() {
      return this.state.dropdownVisible ? 'block' : 'none';
    }

    hideDropdown(e) {
      this.setState({dropdownVisible: false});
    }

    removeCitation(citationText) {
      const value = this.props.value;
      value.splice(this.props.value.indexOf(citationText), 1);
      const syntheticEvent = {target: { name: this.props.name,
        value } }
      this.props.instantQuery(syntheticEvent);
    }

    render() {
      return <div className="filter" onBlur={this.hideDropdown}>
          <label className="label" htmlFor={this.props.name + "-filter"}>{this.props.label}</label>
          {this.props.value && this.props.value.map(citationText => {
            return <Checkbox key={citationText} name={citationText} label={citationText}
            checked={true} handleChange={() => this.removeCitation(citationText)} />
          })}
          <div className="combo combo--search--mini"  style={{position: 'relative', display: 'block'}}>
            <input id={this.props.name + "-filter"} type="text" name={this.props.name} className="combo__input"
                value={this.state.currentValue} onChange={this.interceptChange}/>
          <div className="tt-menu" aria-live="polite"
           style={{position: 'absolute', top: '100%', left: '0px', zIndex: 100, display: this.dropdownDisplay()}}>
          <div className="tt-dataset tt-dataset-candidate">
          <span className="tt-suggestion__header">Select a citation:</span>
          {this.state.citations.map((citation) => {
              return <div key={citation.text} onMouseDown={() => this.setSelection(citation.text)}
                className="selectCitation"><span className="tt-suggestion tt-selectable">
              <span className="tt-suggestion__name">{citation.text}</span>
              {citation.formerly && <span className="tt-suggestion__office">(formerly {citation.formerly})</span>}
              </span></div>
            })}
          </div></div></div></div>
}}

module.exports = CitationFilter;
