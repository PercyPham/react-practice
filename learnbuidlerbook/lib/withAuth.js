import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";

let globalUser = null;

function withAuth(
  BaseComponent,
  { loginRequired = true, logoutRequired = false } = {}
) {
  class App extends React.Component {
    static propTypes = {
      user: PropTypes.shape({
        displayName: PropTypes.string,
        email: PropTypes.string.isRequired
      }),
      isFromServer: PropTypes.bool.isRequired
    };

    static defaultProps = {
      user: null
    };

    componentDidMount() {
      const { user, isFromServer } = this.props;

      if (isFromServer) {
        globalUser = user;
      }

      const userLoggedIn = !!user;

      if (loginRequired && !logoutRequired && !userLoggedIn) {
        Router.push("/login");
        return;
      }

      if (logoutRequired && userLoggedIn) {
        Router.push("/");
      }
    }

    static async getInitialProps(ctx) {
      const isFromServer = !!ctx.req;
      const user = ctx.req
        ? ctx.req.user && ctx.req.user.toObject()
        : globalUser;

      if (isFromServer && user) {
        // Convert "_id"(ObjectID from MongoDB) object to string
        user._id = user._id.toString();
      }

      const props = { user, isFromServer };

      if (BaseComponent.getInitialProps) {
        Object.assign(props, (await BaseComponent.getInitialProps(ctx)) || {});
      }

      return props;
    }

    render() {
      const { user: userLoggedIn } = this.props;

      if (loginRequired && !logoutRequired && !userLoggedIn) {
        return null;
      }

      if (logoutRequired && userLoggedIn) {
        return null;
      }

      return <BaseComponent {...this.props} />;
    }
  }

  return App;
}

export default withAuth;
