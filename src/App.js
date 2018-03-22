import React, { Component } from 'react';
import ReactTable from "react-table";
import axios from "axios";
import _ from 'lodash'
import logo from './logo.svg';
import './App.css';
import "react-table/react-table.css"

const requestData = (pageSize, page, sorted, filtered) => {
  console.log('PageSize',pageSize)
  console.log('page', page)
  console.log('sorted', sorted)
  console.log('filtered', filtered)

  return axios.get('data.json').then((response) => {
     let filterData = response.data.items          

     const res = {
      rows: filterData.slice(pageSize * page, pageSize * page + pageSize),
      pages: Math.ceil(filterData.length / pageSize)
     };
     return res 
  })
}

class App extends Component {
  
  constructor() {
    super()
    this.state = {
      data: [],
      pages: null,
      loading: true
    }
  }

  componentDidMount() {
    axios.get('data.json').then((response) => {
      this.setState({
        //data: (response.data.items)
      })
    })
  }

  fetchData = (state, instance) => {
     requestData(state.pageSize, state.page, state.sorted, state.filtered).then(res => {
         this.setState({
           data: res.rows,
           pages: res.pages,
           loading: false
         })
     })
  }

  render() {
    const {data, pages, loading} = this.state

    return (
      <div className="App">
         <ReactTable
          data={data}
          columns={[
            {
              Header: "Product Name",
              accessor: "name"
            },
            {
              Header: "Price",
              accessor: "price"
            },
            {
              Header: 'SKU',
              accessor: "sku"
            },
            {
              Header: 'Action',
              accessor: 'id',
              Cell: row => (
                <div>
                 <a href={row.value}>Edit</a>
                 &nbsp;
                 <a href="#">Delete</a>
                </div>
              ),
              filterable:false,
              sortable: false           
            }
          ]}
          manual
          pages={pages}
          loading={loading}
          onFetchData={this.fetchData}
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default App;
