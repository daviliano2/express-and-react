import React, { useState, useEffect } from 'react';
import logo from './gymondo-logo.jpg';
import './App.css';

function App() {
  const [workouts, setWorkouts] = useState([])
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/workouts`)
        const parsedResponse = await response.json()

        setPagination({ 
          page: parsedResponse.data.page, 
          totalPages: parsedResponse.data.totalPages,
          totalItems: parsedResponse.data.totalItems,
        })
        setFilters({
          category: parsedResponse.data.category,
          startDate: parsedResponse.data.startDate,
        })
        setWorkouts(parsedResponse.data.items)
      } catch (err) {
        console.error(`something went wrong: ${err}`)
      }
    }

    fetchData()
  }, [])

  const getPage = async (page) => {
    try {
      const response = await fetch(`/workouts/${page}`)
      const parsedResponse = await response.json()

      setPagination({ 
        page: parsedResponse.data.page, 
        totalPages: parsedResponse.data.totalPages,
        totalItems: parsedResponse.data.totalItems,
      })
      setFilters({
        category: parsedResponse.data.category,
        startDate: parsedResponse.data.startDate,
      })
      setWorkouts(parsedResponse.data.items)
    } catch (err) {
      console.error(`something went wrong: ${err}`)
    }
  }

  const showPagination = () => {
    const currentPage = pagination.page
    const buttons = []
    
    if (currentPage <= 5) {
      for(let i = 1; i <= 10; i++) {
        if (i <= pagination.totalPages) {
          buttons.push(
            <button key={`page-${i}`} className="page-button margin-lr-5" onClick={() => getPage(i)}>
              {i}
            </button>
          )
        }
      }
    } else if (currentPage > 5) {
      for(let i = currentPage - 5; i <= currentPage + 5; i++) {
        if (i <= pagination.totalPages) {
          buttons.push(
            <button key={`page-${i}`} className="page-button margin-lr-5" onClick={() => getPage(i)}>
              {i}
            </button>
          )
        }
      }
    }
    
    return buttons
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="gymondo-logo" alt="logo" />
      </header>
      {
        workouts.map((workout, index) => (
          <div key={`${workout.name}-${index}`}>{workout.name} {workout.category}</div>
        ))
      }
      {pagination.totalPages > 1
        ? (
          <>
            <div className="pagination">
              {showPagination()}
            </div>
            <button className="go-first-last margin-lr-5" onClick={() => getPage(1)}>
              Go to first page
            </button>
            <button className="go-first-last margin-lr-5" onClick={() => getPage(pagination.totalPages)}>
              Go to last page
            </button>
            <p>displaying {workouts.length} out of {pagination.totalItems} workouts</p>
          </>
        ) : (
          <p>displaying {workouts.length} out of {workouts.length} workouts</p>
        ) 
      }
    </div>
  );
}

export default App;
