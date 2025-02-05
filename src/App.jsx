import { useEffect, useState } from 'react';
import Search from './components/Search';


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
      method: 'GET',
      headers: {
            accept: 'application/json',
            Authorization: "Bearer API_KEY "
      }
}

const App = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const [errorMessage, setErrorMessage] = useState('');
      const [movieList, setMovieList] = useState([]);
      const [isLoading, setIsLoading] = useState(false);

     const fetchMovies = async () => {
      setErrorMessage('');
      setIsLoading(true);
      try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);
      
            if(!response.ok){
               throw new Error("Failed to fetch movies");  
            }

        const data = await response.json();

        console.log(data);
        
        if(data.Response === "False"){
            setErrorMessage( data.Error || "Failed to fetch movies.");
            setMovieList([]);
            return;
        }

        setMovieList(data.results);

      } catch (error) {
           console.log(`Error fetching movies: ${error}`);
           setErrorMessage('Error fetching movies, please try again latter')
      } finally{
         setIsLoading(false);
      }
     }

      useEffect(() =>{
       fetchMovies();
      }, [])

      return (
            <main>
                  <div className="pattern">
                        <div className="wrapper">
                              <header>
                                    <img src="./hero.png" alt="Banner image" />
                                    <h1>
                                          Find <span className="text-gradient"> Movies </span> you will Love!
                                    </h1>
                                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                              </header>
                              <section className="all-movies">
                                <h1>All Movies</h1>
                                {isLoading ? (
                                    <p className='text-white'>Loading...</p>
                                ) : errorMessage ? (
                                    <p className='text-red-500'>{errorMessage}</p>
                                ) : (
                                    <ul>
                                      {movieList.map((movie) => (
                                          <p key={movie.id} className='text-white'>{ movie.title}</p>
                                      ))}
                                    </ul>
                                )}
                                <p className='text-white text-3xl'>Current Passport</p>
                              </section>
                        </div>

                  </div>
            </main>
      )
}

export default App;
