import React, { Component } from "react";
import { func } from "prop-types";

const contextTypes = {
  subscribe: func,
  unsubscribe: func
};

class Observable extends Component {
  state = { isVisible: false }
  onRef = (ref) => {
    this.ref = ref;
  }
  onEnter = () => {
    this.setState({ isVisible: true }, () => {
      const { onLeave, onEnter, children, onceOnly, ...props } = this.props;
      this.props.onEnter && this.props.onEnter(props);
      this.props.onceOnly && this.unsubscribe(this.ref);
    });
  }
  onLeave = () => {
    const { onLeave, onEnter, children, onceOnly, ...rest } = this.props;
    this.setState({ isVisible: false }, () => {
      this.props.onLeave && this.props.onLeave(rest);
    });
  }
  componentDidMount() {
    if (!this.context.subscribe) {
      throw new Error(
        "Expected Observable to be mounted within IntersectionObserver"
      );
    }
    this.context.subscribe(this.ref, this.onLeave, this.onEnter);
  }
  render() {
    const { isVisible } = this.state;
    const { onLeave, onEnter, children, onceOnly, ...rest } = this.props;
    return (
      <div ref={this.onRef} {...rest}>
        {typeof children === "function" ? children(isVisible) : children}
      </div>
    );
  }
}

Observable.contextTypes = contextTypes;
export default Observable;
