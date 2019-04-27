/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/">Explore</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/">Profile</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/">Logout</router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Project 2</h1>
        <p class="lead">
            <router-link class="nav-link" to="/register">Register</router-link>
            <router-link class="nav-link" to="/login">Login</router-link>
        </p>
    </div>
   `,
    data: function() {
       return {}
    }
});

const RegisterForm = Vue.component('register-form', {
    template: `
    <div>
        <h1 class='mb-4'>Register</h1>
        <form id="registerForm" @submit.prevent='registerUser' enctype='multipart/form-data' novalidate>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" name="username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" name="password">
            </div>
            <div class="form-group">
                <label for="firstname">Firstname</label>
                <input type="text" class="form-control" id="firstname" name="firstname">
            </div>
            <div class="form-group">
                <label for="lastname">Lastname</label>
                <input type="text" class="form-control" id="lastname" name="lastname">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" name="email">
            </div>
            <div class="form-group">
                <label for="location">Location</label>
                <input type="text" class="form-control" id="location" name="location">
            </div>
            <div class='form-group'>
                <label for="biography">Description</label>
                <textarea id="biography" class="form-control" name="biography"></textarea>
            </div>
            
            <div class='form-group'>
                <label for='photo'>Photo</label>
                <input type='file' id='photo' class='form-control file-input' name='profile_photo'>
            </div>
            
            <button type='submit' class='btn btn-primary'>Register</button>
        </form>
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
                router.push('login')
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
    <div>
        <h1 class='mb-4'>Login</h1>
        <form id="loginForm" @submit.prevent='loginUser' enctype='multipart/form-data' novalidate>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" name="username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" name="password">
            </div>
            
            <button type='submit' class='btn btn-primary'>Login</button>
        </form>
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
                router.push('explore')
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
    template: ``,
    created: function () {
        localStorage.removeItem('token');
        router.push('home')
    }
})

const Explore = Vue.component('explore', {
    template: `
        <div>
            <p>Explore page</p>
            <ul>
                <li v-for='post in posts'>
                    {{ post }}
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

const NewPostForm = Vue.component('new-post-form', {
    template: `
        <div>
            <form id="newPostForm" @submit.prevent='makePost' enctype='multipart/form-data' novalidate>
                <div class='form-group'>
                    <label for='photo'>Photo</label>
                    <input type='file' id='photo' class='form-control file-input' name='photo'>
                </div>
                
                <div class='form-group'>
                    <label for="caption">Caption</label>
                    <textarea id="caption" class="form-control" name="caption"></textarea>
                </div>
                
                <button type='submit' class='btn btn-primary'>Submit</button>
            </form>
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
                router.push('explore');
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
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});