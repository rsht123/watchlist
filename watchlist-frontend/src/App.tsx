import { useEffect } from 'react';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import Auth from './Pages/Auth.tsx';
import RegisterForm from './Pages/RegisterForm.tsx';
import LoginForm from './Pages/LoginForm.tsx';
import Application from './Pages/Application.tsx';
import CheckAuth from './components/CheckAuth.tsx';
import Search from './Pages/Search.tsx';
import { useWhoAmIQuery } from './redux/apiSlices/authSlice.ts';
import { saveUser } from './redux/slices/userSlice.ts';
import { useAppDispatch, useAppSelector } from './redux/store.ts';
import { Spin } from 'antd';
import Discover from './Pages/Discover.tsx';
import Trending from './Pages/Trending.tsx';
import UserLists from './Pages/UserLists.tsx';
import Watchlist from './Pages/Watchlist.tsx';
import Favorites from './Pages/Favorites.tsx';
import Lists from './Pages/Lists.tsx';
import Profile from './Pages/Profile.tsx';
import ListDetails from './Pages/ListDetails.tsx';
import TitlePage from './Pages/TitlePage.tsx';
import SeasonPage from './Pages/SeasonPage.tsx';
import CreditPage from './Pages/CreditPage.tsx';
import PersonPage from './Pages/PersonPage.tsx';
import EpisodePage from './Pages/EpisodePage.tsx';
import CollectionPage from './Pages/CollectionPage.tsx';

// TODO: refactor components and remove unused types;
function App() {
  const { data, isLoading } = useWhoAmIQuery();
  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(saveUser(data));
    }
  }, [data]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {isLoading && <Route path="" element={<CheckAuth />} />}
        {!isLoading && !user && !data && (
          <Route path="" element={<Auth />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route index element={<Navigate to="/login" />} />
          </Route>
        )}
        {!isLoading && (user || data) && (
          <Route path="" element={<Application />}>
            <Route path="/search" element={<Search />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/user-lists" element={<UserLists />} />
            <Route path="/user-lists/:listId" element={<ListDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/title/collection/:collection_id"
              element={<CollectionPage />}
            />
            <Route path="/title/seasons/:media_id" element={<SeasonPage />} />
            <Route
              path="/title/tv/:media_id/season/:season_number/episode/:episode_number"
              element={<EpisodePage />}
            />
            <Route path="/credit/:credit_id" element={<CreditPage />} />
            <Route path="/person/:person_id" element={<PersonPage />} />
            <Route
              path="/title/:media_type/:media_id"
              element={<TitlePage />}
            />
            <Route path="*" element={<Navigate to="/search" />} />
          </Route>
        )}
      </>
    )
  );

  if (isLoading) {
    return <Spin />;
  }

  return <RouterProvider router={router} />;
}

export default App;
