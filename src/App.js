import React, { Component } from "react";
import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";

class App extends Component {
  state = {
    currentAuthor: null,
    filteredAuthors: [],
    authors: [],
    loading: true
  };

  loading = "The page is currently loading, please wait";

  async componentDidMount() {
    try {
      let response = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors"
      );
      this.setState({ authors: response.data, loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  selectAuthor = async author => {
    let res = await axios.get(
      `https://the-index-api.herokuapp.com/api/authors/${author.id}/`
    );
    console.log(res);
    const currAuthor = res.data;
    this.setState({ currentAuthor: currAuthor });
  };

  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      return (
        <AuthorsList
          authors={this.state.authors}
          /*  {authors={this.state.filteredAuthors} }*/
          selectAuthor={this.selectAuthor}
          filterAuthors={this.filterAuthors}
        />
      );
    }
  };

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
