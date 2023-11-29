import React, {useState, useEffect} from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';


const GithubContext = React.createContext()

const GithubProvider = ({children}) => {

    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);
    const [requests, setRequests] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({show: false, msg: ""})

    const getRequests = () => {
        axios(`${rootUrl}/rate_limit`)
            .then(({data}) => {
                let {rate: {remaining}} = data;
                setRequests(remaining)
                if (remaining === 0) {
                    toggleError(true, 'sorry, you have exceeded your request limit')
                }
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getRequests();
    }, []);

    function toggleError(show = false, msg = '') {
        setError({show, msg})
    }

    const searchForGitHubUser = async (user) => {
        toggleError()

        setLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`)
            .catch((error) => console.log(error))

        if (response) {
            setGithubUser(response.data);

            const {login, followers_url} = response.data;

            await Promise.allSettled(
                [
                    axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                    axios(`${followers_url}?per_page=100`)
                ]
            ).then((result) => {
                const [repos, followers] = result
                const status = 'fulfilled';
                if (repos.status === status) {
                    setRepos(repos.value.data)
                }
                if (followers.status === status) {
                    setFollowers(followers.value.data)
                }
            })
        } else {
            toggleError(true, "there is no user with that username")
        }
        getRequests();
        setLoading(false)
    }

    return (
        <GithubContext.Provider value={{
            githubUser: githubUser,
            repos: repos,
            followers: followers,
            requests: requests,
            error: error,
            searchForGitHubUser: searchForGitHubUser,
            loading: loading,
        }}>
            {children}
        </GithubContext.Provider>
    )
}

export {GithubProvider, GithubContext}