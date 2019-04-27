Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <router-link class="navbar-brand logo-brand d-flex flex-row justify-content-center align-items-center" to="/">
        <span style="font-size: 25px;"><i class="fab fa-instagram mr-1"></i></span>
        <h4>Photogram</h4>
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/explore">Explore</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="profileUrl">My Profile</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/logout">Logout</router-link>
          </li>
        </ul>
      </div>
    </nav>
    `,
    data: function() {
        return {
            userId: null,
            profileUrl: '/users/' +  jwt_decode(localStorage.getItem('token')).id,
        }
    }
});

Vue.component('app-footer', {
    template: `
    <footer hidden>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
    template: `
    <div class="d-flex flex-row justify-content-around">
        <img :src=imgUrl class="shadow-sm bg-white rounded">
        
        <div class="shadow-sm p-4 mb-5 bg-white rounded">
            <div class="logo-brand d-flex flex-row justify-content-center align-items-center">
                <span style="font-size: 25px;"><i class="fab fa-instagram mr-1"></i></span>
                <h3>Photogram</h3>
            </div>
            <hr>
            <p>Share photos of your favorite moments with friends, family and the world.</p>
            <div class="d-flex flex-row justify-content-center">
                <router-link class="nav-link btn btn-green font-weight-bold mr-1 w-25" to="/register">Register</router-link>
                <router-link class="nav-link btn btn-blue font-weight-bold ml-1 w-25" to="/login">Login</router-link>
            </div>
        </div>
    </div>
    `,
    created: function() {
        let self = this;
        self.imgUrl = 'https://picsum.photos/450';
    },
    data: function() {
       return {
           imgUrl: ''
       }
    }
});

const RegisterForm = Vue.component('register-form', {
    template: `
    <div class="d-flex flex-column justify-content-center align-items-center">
        <h1 class='mb-4 menu-title'>Register</h1>
        
        <div class="shadow-sm bg-white p-4 rounded w-25">
        <form id="registerForm" @submit.prevent='registerUser' enctype='multipart/form-data' novalidate>
            <div class="form-group">
                <label for="username" class="font-weight-bold">Username</label>
                <input type="text" class="form-control form-control-sm" id="username" name="username">
            </div>
            <div class="form-group">
                <label for="password" class="font-weight-bold">Password</label>
                <input type="password" class="form-control form-control-sm" id="password" name="password">
            </div>
            <div class="form-group">
                <label for="firstname" class="font-weight-bold">Firstname</label>
                <input type="text" class="form-control form-control-sm" id="firstname" name="firstname">
            </div>
            <div class="form-group">
                <label for="lastname" class="font-weight-bold">Lastname</label>
                <input type="text" class="form-control form-control-sm" id="lastname" name="lastname">
            </div>
            <div class="form-group">
                <label for="email" class="font-weight-bold">Email</label>
                <input type="email" class="form-control form-control-sm" id="email" name="email">
            </div>
            <div class="form-group">
                <label for="location" class="font-weight-bold">Location</label>
                <input type="text" class="form-control form-control-sm" id="location" name="location">
            </div>
            <div class='form-group'>
                <label for="biography" class="font-weight-bold">Description</label>
                <textarea id="biography" class="form-control form-control-sm" name="biography"></textarea>
            </div>
            
            <div class='form-group'>
                <label for='photo' class="font-weight-bold">Photo</label>
                <input type='file' id='photo' class='form-control form-control-sm file-input' name='profile_photo'>
            </div>
            
            <button type='submit' class='btn btn-sm btn-green w-100 font-weight-bold'>Register</button>
        </form>
        </div>
    </div>
    `,
    methods: {
        registerUser: function() {
            let registerForm = document.getElementById('registerForm');
            let formData = new FormData(registerForm);
            
            fetch('/api/users/register', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                console.log(jsonResponse);
                router.push({path: '/login'})
            })
            .catch(function(error) {
                console.log(error)
            })
        }
    },
    data: function() {
        return {
            errors: [],
            message: ''
        }
    },
})

const LoginForm = Vue.component('login-form', {
    template: `
    <div class="d-flex flex-column justify-content-center align-items-center">
        <h1 class='mb-4 menu-title'>Login</h1>
        <div class="shadow-sm bg-white p-4 rounded w-25">
        <form id="loginForm" @submit.prevent='loginUser' enctype='multipart/form-data' novalidate>
            <div class="form-group">
                <label for="username" class="font-weight-bold">Username</label>
                <input type="text" class="form-control form-control-sm" id="username" name="username">
            </div>
            <div class="form-group mb-4">
                <label for="password" class="font-weight-bold">Password</label>
                <input type="password" class="form-control form-control-sm" id="password" name="password">
            </div>
            
            <button type='submit' class='btn btn-sm btn-green font-weight-bold w-100 mt-2'>Login</button>
        </form>
        </div>
    </div>
    `,
    methods: {
        loginUser: function() {
            let loginForm = document.getElementById('loginForm');
            let formData = new FormData(loginForm);
            
            fetch('/api/auth/login', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                console.log(jsonResponse);
                localStorage.setItem('token', jsonResponse.token);
                router.push({path: '/explore'})
            })
            .catch(function(error) {
                console.log(error)
            })
        }
    },
    data: function() {
        return {
            errors: [],
            message: ''
        }
    },
})

const Logout = Vue.component('logout', {
    template: `<div></div>`,
    created: function () {
        localStorage.removeItem('token');
        router.push({path: '/'})
    },
})

const PostHeader = Vue.component('post-header', {
    template: `
        <div class="bg-white rounded d-flex flex-row justify-content-start align-items-center post-header px-2">
                <img :src=profileImgUrl class="post-maker-photo mr-1">
            <router-link class="nav-link text-muted font-weight-bold" :to="profileUrl">
                <p class="d-inline align-middle">{{ username }}</p>
            </router-link>
        </div>
    `,
    props: ['userId'],
    created: function() {
        // get the user profile photo and username based on the user id
        let self = this;
        
        self.profileUrl = 'users/' + self.userId;
        
        fetch('/api/users/' + self.userId, {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            self.profileImgUrl ='static/uploads/' + data.profile_photo
            self.username = data.username
        })
        .catch(function(error) {
            console.log(error)
        })  
    },
    data: function() {
        return {
            profileUrl: '',
            profileImgUrl: '',
            username: ''
        }
    }
})

const PostFooter = Vue.component('post-footer', {
    template: `
        <div class="d-flex flex-row justify-content-between p-3 bg-white">
            <span class="font-weight-bold text-muted"><i class="far fa-heart" v-bind:class="{'post-liked': isLiked}" @click="likePost"></i> {{ likes }} Likes</span>
            <span class="font-weight-bold text-muted">{{ date }}</span>
        </div>
    `,
    props: ['postId', 'date'],
    created: function() {
        let self = this;
        
        fetch('/api/posts/' + self.postId + '/like', {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            self.likes = data.likes
        })
        .catch(function(error) {
            console.log(error)
        })  
    },
    methods: {
        likePost: function() {
            let jwt = localStorage.getItem('token');
            let formData = new FormData();
            let self = this;
            
            
            formData.set('user_id', jwt_decode(jwt).id);
            formData.set('post_id', self.postId);
            
            
            fetch('/api/posts/' + self.postId + '/like', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + jwt
                },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                self.isLiked = true;
                self.likes++;
            })
            .catch(function(error) {
                console.log(error)
            })  
        }  
    },
    data: function() {
        return {
            isLiked: false,
            likes: 0
        }
    }
})

const Explore = Vue.component('explore', {
    template: `
        <div class="d-flex flex-row-reverse justify-content-around align-items-center">
            <router-link class="nav-link align-self-start btn btn-sm btn-blue w-25 font-weight-bold" to="/posts/new">New Post</router-link>
            <ul class="d-flex flex-column">
                <li v-for='post in posts' class="shadow-sm rounded bg-white mb-4">
                    <post-header v-bind:user-id="post.user_id"></post-header>
                    <img :src="'static/uploads/' + post.photo" style="height: 400px; width: 500px;">
                    <p class="p-3 bg-white text-muted">{{post.caption}}</p>
                    <post-footer v-bind:post-id="post.id" v-bind:date="post.created_on"></post-footer>
                </li>
            </ul>
        </div>
    `,
    created: function() {
        let self = this;
        
        fetch('/api/posts', {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            self.posts = data.posts;
        })
        .catch(function(error) {
            console.log(error)
        })  
    },
    
    data: function () {
        return {
            posts: []
        }
    }
})

const ProfileBanner = Vue.component('profile-banner', {
    template: `
        <div class="d-flex flex-row justify-content-between bg-white rounded shadow-sm p-3 mb-3">
            <div class="d-flex justify-content-center align-items-center mr-2">
                <img :src="'../static/uploads/' + user.profile_photo" class="profile-img">
            </div>
            <div class="d-flex flex-column">
                <p class="font-weight-bold text-muted">{{ user.firstname }} {{ user.lastname }}</p>
                <p class="text-muted">
                {{ user.location }} <br>
                Member since {{ user.joined_on }}
                </p>
                <p class="text-muted">{{ user.biography }} </p>
            </div>
            <div class="d-flex flex-column justify-content-between">
                <div class="d-flex flex-row justify-content-between">
                    <div class="d-flex flex-column justify-content-center align-items-center p-2">
                        <span class="font-weight-bold text-muted">{{ posts }}</span>
                        <p class="font-weight-bold text-muted">Posts</p>
                    </div>
                    <div class="d-flex flex-column justify-content-center align-items-center p-2">
                        <span class="font-weight-bold text-muted">{{ followers }}</span>
                        <p class="font-weight-bold text-muted">Followers</p>
                    </div>
                </div>
                <button class="btn btn-sm font-weight-bold w-100"
                    v-bind:class="{'btn-green': isFollowing, 'btn-blue': !isFollowing}" @click="followUser">
                    <span v-if="isFollowing">Following</span>
                    <span v-else>Follow</span>
                </button>
            </div>
        </div>
    `,
    props: ['user', 'posts'],
    created: function() {
        let self = this;
        
        fetch('/api/users/' + self.user.id + '/follow', {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            self.followers = data.follower_count
        })
        .catch(function(error) {
            console.log(error)
        })  
    },
    methods: {
        followUser: function() {
            let self = this;
            
            let jwt = localStorage.getItem('token');
            
            let formData = new FormData();
            formData.set('follower_id', jwt_decode(jwt).id);
            
            fetch('/api/users/' + self.user.id + '/follow', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + jwt
                },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                self.isFollowing = true;
                self.followers++;
            })
            .catch(function(error) {
                console.log(error)
            }) 
        }
    },
    data: function() {
        return {
            followers: 0,
            isFollowing: false,
        }
    }
})

const ProfileGallery = Vue.component('profile-gallery', {
    template: `
        <ul class="gallery">
            <li v-for="post in posts"
                class="gallery-item"
                style="max-width: 350px">
                <img :src="'../static/uploads/' + post.photo" class="gallery-img">
            </li>
        </ul>
    `,
    props: ['posts'],
    data: function() {
        return {}
    }
})

const UserProfile = Vue.component('user-profile', {
    template: `
    <div>
        <profile-banner v-bind:user="user" v-bind:posts="user.posts.length"></profile-banner>
        <profile-gallery v-bind:posts="user.posts"></profile-gallery>
    </div>
    `,
    created: function() {
        let self = this;
        
        fetch('/api/users/' + self.$route.params.user_id, {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            self.user = data;
        })
        .catch(function(error) {
            console.log(error)
        })
    },
    data: function() {
        return {
            user: {},
        }
    },
})

const NewPostForm = Vue.component('new-post-form', {
    template: `
        <div class="d-flex flex-column justify-content-center align-items-center">
            <h1 class='mb-4 menu-title'>New Post</h1>
            <div class="shadow-sm bg-white p-4 rounded w-25">
            <form id="newPostForm" @submit.prevent='makePost' enctype='multipart/form-data' novalidate>
                <div class='form-group'>
                    <label for='photo' class="font-weight-bold">Photo</label>
                    <input type='file' id='photo' class='form-control form-control-sm file-input' name='photo'>
                </div>
                
                <div class='form-group'>
                    <label for="caption" class="font-weight-bold">Caption</label>
                    <textarea id="caption" class="form-control form-control-sm" name="caption">Write a Caption...</textarea>
                </div>
                
                <button type='submit' class='btn btn-sm btn-green w-100 font-weight-bold'>Submit</button>
            </form>
            </div>
        </div>
    `,
    methods: {
        makePost: function() {
            let newPostForm = document.getElementById('newPostForm');
            let formData = new FormData(newPostForm);
            
            let jwt = localStorage.getItem('token');
            let userId = jwt_decode(jwt).id;
            
            fetch('/api/users/' + userId + '/posts', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + jwt
                },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                console.log(jsonResponse);
                router.push({path: '/explore'});
            })
            .catch(function(error) {
                console.log(error)
            })
        }
    },
    data: function() {
        return {
            errors: [],
            message: ''
        }
    }
})

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        {path: "/register", component: RegisterForm},
        {path: "/login", component: LoginForm},
        {path: "/logout", component: Logout},
        {path: "/explore", component: Explore},
        {path: "/posts/new", component: NewPostForm},
        {path: "/users/:user_id", component: UserProfile},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});