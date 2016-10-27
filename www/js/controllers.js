angular.module('marvel.controllers', [])

  .controller('ComicsCtrl', function($scope, ComicsService,customComicsService) {

    $scope.actualPage = 20;
    $scope.items = [];
    $scope.comics = [];

    ///////////////////////////////////////////////////////////////////////////
    //Función para inicializar los primeros 20 comics que se muestran en la app
    $scope.initial = function () {
      ComicsService.getData(20,0).success(function(response){
        $scope.comics = response.data.results;
      })
        .error(function(data, status, headers, config){
          console.log("Error al consumir data ");
        });
    }
    //inicializamos
    $scope.initial();
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    // Evento para cargar 20 comics más en caso de llegar al fondo de la pantalla
    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
    });
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    //Función para buscar comics filtrando por nombre y año a la vez
    //nota: solo busca por año si se escriben 4 enteros seguidos/ restricción del servicio
    $scope.change = function(value) {
      $scope.comics = [];
      $scope.searchText = value ;
      if($scope.searchText != ""){
        customComicsService.getData(value).then(function(response){
          angular.forEach(response, function(value, key) {
            $scope.comics = $scope.comics.concat(value.data.data.results)
          });
        })
      }
      else
        $scope.initial();
    };
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    //Función para cargar los siguientes 20 elementos de la lista de comics
    $scope.loadMore = function(actualPage) {
      ComicsService.getData(20,actualPage).success(function(response){
        $scope.items = response.data.results;
        $scope.comics = $scope.comics.concat($scope.items)
        $scope.actualPage= $scope.actualPage + 20;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }).
      error(function(data, status, headers, config){
        console.log("Error al consumir data ");
      });
    };
  })
  ///////////////////////////////////////////////////////////////////////////


  .controller('ComicDetailCtrl', function($scope, $stateParams, ComicsDetailService) {

    $scope.comic = $stateParams.comicId;
    $scope.name = $stateParams.name;
    $scope.comic_detail = {};

    ///////////////////////////////////////////////////////////////////////////
    //Función para cargar los detalles y los personajes de un comic
    $scope.loadDetails = function() {
      ComicsDetailService.getData($scope.comic).then(function(response){
        $scope.comicDetail = response[0].data.data.results;
        $scope.comicCharacters = response[1].data.data.results;
      });
    }
    //inicializamos
    $scope.loadDetails();
    ///////////////////////////////////////////////////////////////////////////
  })

