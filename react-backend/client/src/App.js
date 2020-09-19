import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

async function fetchPost(data = {}) {
  const response = await fetch(`/workouts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  return response.json();
}

function App() {
  const initialCategoriesState = [
    { name: "c1", checked: false },
    { name: "c2", checked: false },
    { name: "c3", checked: false },
    { name: "c4", checked: false },
    { name: "c5", checked: false },
    { name: "c6", checked: false },
    { name: "c7", checked: false },
  ];
  const [workouts, setWorkouts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState(initialCategoriesState);
  const [startDate, setStartDate] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/workouts`);
        const parsedResponse = await response.json();

        setPagination({
          page: parsedResponse.data.page,
          totalPages: parsedResponse.data.totalPages,
          totalItems: parsedResponse.data.totalItems,
        });
        setWorkouts(parsedResponse.data.items);
      } catch (err) {
        console.error(`something went wrong: ${err}`);
      }
    };

    fetchData();
  }, []);

  const getPage = async (page) => {
    try {
      const response = await fetchPost({ page, startDate, categories });

      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
      });
      setWorkouts(response.data.items);
    } catch (err) {
      console.error(`something went wrong: ${err}`);
    }
  };

  const selectDate = async (startDate) => {
    setStartDate(startDate);

    try {
      const response = await fetchPost({ startDate, categories });

      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
      });
      setWorkouts(response.data.items);
    } catch (err) {
      console.error(`something went wrong: ${err}`);
    }
  };

  const filterByCategory = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchPost({ startDate, categories });

      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
      });
      setWorkouts(response.data.items);
    } catch (err) {
      console.error(`something went wrong: ${err}`);
    }
  };

  const handleCategoryChange = (event) => {
    const target = event.target;
    const value = target.checked;
    const name = target.name;
    const updatedCategories = [...categories];

    categories.forEach((category, index) => {
      if (category.name === name) updatedCategories[index].checked = value;
    });

    setCategories(updatedCategories);
  };

  const cleanFilters = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchPost({});

      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
      });
      setWorkouts(response.data.items);
      setCategories(initialCategoriesState);
      setStartDate(null);
    } catch (err) {
      console.error(`something went wrong: ${err}`);
    }
  };

  const showDetails = (workout) => {
    setSelectedWorkout(workout);
  };

  const showPagination = () => {
    const currentPage = pagination.page;
    const buttons = [];

    if (currentPage <= 5) {
      for (let i = 1; i <= 10; i++) {
        if (i <= pagination.totalPages) {
          const selectedClassName =
            i === currentPage
              ? "page-button margin-lr-5 selected-page"
              : "page-button margin-lr-5";
          buttons.push(
            <button
              key={`page-${i}`}
              className={`${selectedClassName}`}
              onClick={() => getPage(i)}
            >
              {i}
            </button>
          );
        }
      }
    } else if (currentPage > 5) {
      for (let i = currentPage - 5; i <= currentPage + 5; i++) {
        if (i <= pagination.totalPages) {
          const selectedClassName =
            i === currentPage
              ? "page-button margin-lr-5 selected-page"
              : "page-button margin-lr-5";
          buttons.push(
            <button
              key={`page-${i}`}
              className={`${selectedClassName}`}
              onClick={() => getPage(i)}
            >
              {i}
            </button>
          );
        }
      }
    }

    return buttons;
  };

  return (
    <div>
      <header className="App-header">
        <div className="company-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.3 19.8">
            <path
              d="M31 13.7a3.81 3.81 0 0 1-3.9-4 3.89 3.89 0 0 1 4-4 3.56 3.56 0 0 1 3 1.5l-.9.8a2.61 2.61 0 0 0-2.1-1.1 2.56 2.56 0 0 0-2.5 2.8 2.66 2.66 0 0 0 2.6 2.9 2.88 2.88 0 0 0 1.9-.6v-1.3h-1.9V9.5h3.2v3a5.61 5.61 0 0 1-3.4 1.2zm17.7-.2v-3.1c0-.7-.4-1.2-1-1.2s-1.1.5-1.1 1.3v3h-1.3v-3.1c0-.8-.4-1.2-1-1.2s-1.1.5-1.1 1.4v2.9h-1.3V8.2h1.2V9l.1-.1a1.9 1.9 0 0 1 1.5-.8 1.54 1.54 0 0 1 1.5.8l.1.1.1-.1a1.66 1.66 0 0 1 1.5-.8 2 2 0 0 1 2.1 2.1v3.3zm5.2.2a2.76 2.76 0 0 1-2.9-2.8 2.7 2.7 0 0 1 2.9-2.8 2.82 2.82 0 0 1 2.9 2.8 2.76 2.76 0 0 1-2.9 2.8zm0-4.6a1.69 1.69 0 0 0-1.6 1.8 1.61 1.61 0 1 0 3.2 0c-.1-1-.7-1.8-1.6-1.8zm19.5 4.6a2.8 2.8 0 1 1 0-5.6 2.82 2.82 0 0 1 2.9 2.8 2.7 2.7 0 0 1-2.9 2.8zm0-4.6a1.69 1.69 0 0 0-1.6 1.8 1.61 1.61 0 1 0 3.2 0 1.69 1.69 0 0 0-1.6-1.8zm-11.8 4.4v-3a1.18 1.18 0 0 0-1.2-1.3 1.32 1.32 0 0 0-1.3 1.5v2.8h-1.3V8.2H59v1l.1-.3a1.77 1.77 0 0 1 1.6-.9 2 2 0 0 1 2.1 2.1v3.3a5.28 5.28 0 0 1-1.2.1zm4.9.2a2.63 2.63 0 0 1-2.6-2.8 2.65 2.65 0 0 1 2.7-2.8 2 2 0 0 1 1.6.6l.1.1V5.9h1.3v7.6h-1.2v-.7l-.1.2a2.14 2.14 0 0 1-1.8.7zm.3-4.5a1.6 1.6 0 0 0-1.6 1.7 1.61 1.61 0 1 0 3.2 0 1.61 1.61 0 0 0-1.6-1.7zm-29.2 6.6a4 4 0 0 1-2.2-.6l.6-1a2.82 2.82 0 0 0 1.5.4 1.58 1.58 0 0 0 1.8-1.6v-.7l-.1.3a1.82 1.82 0 0 1-1.6.8 2 2 0 0 1-2.1-2.1V8.1h1.3v2.8c0 .8.4 1.3 1.2 1.3a1.32 1.32 0 0 0 1.3-1.5V8.1h1.3v4.8a2.86 2.86 0 0 1-3 2.9zm-23.7 4a6.09 6.09 0 0 1-2.8-.6 6 6 0 0 1-2.7.6C3.8 19.8 0 15.4 0 9.9S3.6 0 8.2 0a4.91 4.91 0 0 1 2.7.6 5.67 5.67 0 0 1 2.7-.6c3.1 0 5.9 2.1 5.9 4.4A2.58 2.58 0 0 1 16.9 7c-1.7 0-2.7-1.3-3.6-2.6a10 10 0 0 0-2.4-2.6 9.28 9.28 0 0 0-4.2 8.1c0 3.7 1.8 6.9 4.4 8.2a7.33 7.33 0 0 0 3.8-6.2v-.2a3.71 3.71 0 0 1-2.8 1.5 2.82 2.82 0 0 1-2.9-2.8 2.93 2.93 0 0 1 3-2.9 3.88 3.88 0 0 1 3.2 2.1 3.69 3.69 0 0 1 2.7-1.3 3.31 3.31 0 0 1 3.2 3.5c-.1 4.2-3.5 8-7.4 8zm-1.5-1.3a5.9 5.9 0 0 0 1.4.2c3.4 0 6.3-3.3 6.3-7 0-.7-.4-2.4-2.1-2.4a3.07 3.07 0 0 0-2.2 1.2 5.07 5.07 0 0 1 .2 1.3 7.67 7.67 0 0 1-3.6 6.7zM8.3 1.1c-4 0-7.1 3.9-7.1 8.8s3.3 8.8 7.3 8.8a5.85 5.85 0 0 0 1.3-.2 10.2 10.2 0 0 1-4.2-8.6 10.53 10.53 0 0 1 4.1-8.6 5.21 5.21 0 0 0-1.4-.2zm4 7.5a1.74 1.74 0 0 0-1.9 1.7 1.7 1.7 0 0 0 1.8 1.7 3.66 3.66 0 0 0 2.5-1.6 3 3 0 0 0-2.4-1.8zm-.1-7.3a11 11 0 0 1 2.1 2.3c1 1.3 1.6 2.1 2.7 2.1a1.41 1.41 0 0 0 1.4-1.4c0-1.5-2.1-3.2-4.8-3.2a5.9 5.9 0 0 0-1.4.2z"
              fill="#fff"
            ></path>
          </svg>
        </div>
      </header>

      {selectedWorkout ? (
        <div className="content-wrapper">
          <div className="details-list-wrapper">
            <div className="details-header-container">
              <div className="columns">Name</div>
              <div className="columns">Description</div>
              <div className="columns">Start Date</div>
              <div className="columns">Category</div>
            </div>
            <div className="details-row">
              <div className="columns">{selectedWorkout.name}</div>
              <div className="columns">{selectedWorkout.description}</div>
              <div className="columns">{selectedWorkout.startDate}</div>
              <div className="columns">{selectedWorkout.category}</div>
            </div>
          </div>
          <button
            className="go-first-last margin-lr-5"
            onClick={() => showDetails(null)}
          >
            Go back to list
          </button>
        </div>
      ) : (
        <>
          <div className="filters-wrapper">
            <span className="categories-header">Choose a Start Date:</span>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              maxDate={addDays(new Date(), 365)}
              selected={startDate || new Date()}
              onChange={selectDate}
            />

            <div className="categories-wrapper">
              <span className="categories-header">Choose a category:</span>
              {categories.map((category, index) => (
                <span
                  key={`wrapper-${category.name}-${index}`}
                  className="options"
                >
                  <label key={`label-${category.name}-${index}`}>
                    {category.name}
                  </label>
                  <input
                    key={`${category.name}-${index}`}
                    name={category.name}
                    type="checkbox"
                    checked={category.checked}
                    onChange={handleCategoryChange}
                  />
                </span>
              ))}
              <form onSubmit={filterByCategory}>
                <input
                  className="apply-filters"
                  type="submit"
                  value="Filter by Category"
                ></input>
              </form>
              <form onSubmit={cleanFilters}>
                <input
                  className="remove-filters"
                  type="submit"
                  value="Remove Filters"
                ></input>
              </form>
            </div>
          </div>

          <div className="content-wrapper">
            <div className="list-wrapper">
              <div className="header-container">
                <div className="columns">Name</div>
                <div className="columns">Category</div>
                <div className="columns">startDate</div>
              </div>
              {workouts.map((workout, index) => (
                <div
                  key={`${workout.name}-${index}`}
                  className="rows"
                  onClick={() => showDetails(workout)}
                >
                  <div className="columns">{workout.name}</div>
                  <div className="columns">{workout.category}</div>
                  <div className="columns">{workout.startDate}</div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 ? (
              <>
                <div className="pagination">{showPagination()}</div>
                <button
                  className="go-first-last margin-lr-5"
                  onClick={() => getPage(1)}
                >
                  Go to first page
                </button>
                <button
                  className="go-first-last margin-lr-5"
                  onClick={() => getPage(pagination.totalPages)}
                >
                  Go to last page
                </button>
                <p>
                  displaying {workouts.length} out of {pagination.totalItems}{" "}
                  workouts
                </p>
              </>
            ) : (
              <p>
                displaying {workouts.length} out of {workouts.length} workouts
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
