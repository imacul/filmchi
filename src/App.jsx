import { useEffect, useState } from 'react';
import Search from './components/Search';
import  Spinner  from "./components/Spinner";
import MovieCard from './components/MovieCard';
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_ACESS_TOKEN;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,  // ✅ Corrected API key usage
    }
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
    const [ trendingMovies, setTrendingMovies] = useState([]);

     
    const loadTrendingMovies = async () => {
        try {
            const movies  = await getTrendingMovies();

            setTrendingMovies(movies);
        } catch (error) {
            console.log(`Error fetching movies ${error}`);
        }
    }
    

    const fetchMovies = async (query = "") => {
        setErrorMessage('');
        setIsLoading(true);
        try {
            const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }

            const data = await response.json();

            if (!data.results || !Array.isArray(data.results)) {
                      setErrorMessage(data.status_message || "Failed to fetch movies.");
                            setMovieList([]);
                                  return;
                                  }
          setMovieList(data.results);
          

          
     if(query && data.results.length > 0 ) {
        await updateSearchCount(query, data.results[0]);
     }
          
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies, please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useDebounce( () => setDebounceSearchTerm(searchTerm), 2000, [searchTerm]);

    useEffect(() => {
        const getMovies = async () => {
            await fetchMovies(searchTerm);
        };
        getMovies();
    }, [debounceSearchTerm]);


    useEffect(() => {
        loadTrendingMovies();
    }, []);

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
                    
                    {trendingMovies.length > 0 && (
                        <section className="trending">
                          <h2>Trending Movies</h2>
              
                          <ul>
                            {trendingMovies.map((movie, index) => (
                              <li key={movie.$id}>
                                <p>{index + 1}</p>
                                <img src={movie.poster_url} alt={movie.title} />
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
              
                    <section className="all-movies">
                        <h1>All Movies</h1>
                        {isLoading ? (
                        <div className='text-center justify-center items-center'>
                            <Spinner />
                            </div>
                        ) : errorMessage ? (
                            <p className='text-red-500'>{errorMessage}</p>
                        ) : (
                            <ul>
                                {movieList.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie}/>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default App;