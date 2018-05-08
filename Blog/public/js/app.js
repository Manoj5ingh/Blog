
var app = angular.module("BlogApp",[]);

/*
    angular
        .module("BlogApp",[])
        .controller("BlogCtrl",BlogCtrl);

*/

app.controller("BlogCtrl",BlogCtrl);

    function BlogCtrl($scope,$http){
        $scope.createPost = createPost;
        $scope.deletePost = deletePost;
        $scope.editPost = editPost;
        $scope.updatePost = updatePost;

        function init(){
            getAllPosts();
        }
        init();

        function getAllPosts(){
            $http.get("/api/getPosts").success(function(posts){
                console.log(posts);
                $scope.posts = posts;
                $scope.post = '';
            });
        }

        function createPost(post){
            console.log(post);
            $http.post("/api/blogpost",post).success(getAllPosts);
        }

        function deletePost(postId){
            $http.delete("/api/blogpost/"+postId).success(getAllPosts);
        }

        function editPost(postId){
            $http.get("/api/blogpost/"+postId).success(
                function(post){
                    $scope.post = post;
                }
            );
        }

        function updatePost(post){
            $http.put("/api/blogpost/"+post._id,post).success(getAllPosts);
        }
    }
