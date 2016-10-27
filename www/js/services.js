angular.module('marvel.services', [])

  //Fabrica para la consulta de todos los comics de la aplicación
  .factory('ComicsService', function($http, $rootScope, md5) {

    //elimino elemento del header (doc del api)
  delete $http.defaults.headers.common['X-Requested-With'];
  var keyPublic = $rootScope.key_public;
  var keyPrivate = $rootScope.key_private;
  var ts = new Date().getTime();
  var hash = md5.createHash(ts + keyPrivate + keyPublic);
  var marvelApi = [];

    //a través de los parametros de limit y offset indico en la página donde estoy y cuantos
    //más quier mostrar
  marvelApi.getData = function(limit,offset) {
    return $http({
      method: 'GET',
      url: 'http://gateway.marvel.com/v1/public/comics',
      params: {
        "ts": ts,
        "apikey": keyPublic,
        "hash": hash,
        "limit":limit,
        "offset": offset
      }
    });
  }

  return marvelApi;

})
  //Fabrica para la consultar los comics por nombre y año a la vez
  .factory('customComicsService', function($http, $rootScope, md5, $q) {

    //cancelo todas las peticiones en cola, esto ya que si la persona escribe el nombre rapido
    //por cada letra se esta llamando el servicio, esto hace que cada letra escrita cancele el anterior
    var canceler = $q.defer();
    canceler.resolve();

    //evaluo si lo introducido en el input es un número de 4 digitos/ restricción del api
    function isInt(value) {
      return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    }
    //elimino elemento del header (doc del api)
    delete $http.defaults.headers.common['X-Requested-With'];

    var keyPublic = $rootScope.key_public;
    var keyPrivate = $rootScope.key_private;
    var ts = new Date().getTime();
    var hash = md5.createHash(ts + keyPrivate + keyPublic);
    var marvelApi = [];

    marvelApi.getData = function(search) {

      //arreglo de promesas para busqueda por título y año
      var promises = [];
      promises.push($http({
        method: 'GET',
        url: 'http://gateway.marvel.com/v1/public/comics',
        params: {
          "ts": ts,
          "apikey": keyPublic,
          "hash": hash,
          "titleStartsWith": search
        }
      }))

      //si lo introducido es un número de 4 digitos hago la busqueda por año
      if(isInt(search) && (search.length == 4) ){
        promises.push( $http({
        method: 'GET',
        url: 'http://gateway.marvel.com/v1/public/comics',
        params: {
          "ts": ts,
          "apikey": keyPublic,
          "hash": hash,
          "startYear": search
        }
      }))
      }
      return $q.all(promises);
    }

    return marvelApi;

  })

  .factory('ComicsDetailService', function($http, $rootScope, md5,$q) {
    //elimino elemento del header (doc del api)
    delete $http.defaults.headers.common['X-Requested-With'];

    var keyPublic = $rootScope.key_public;
    var keyPrivate = $rootScope.key_private;
    var ts = new Date().getTime();
    var hash = md5.createHash(ts + keyPrivate + keyPublic);
    var marvelApi = [];

    marvelApi.getData = function(idComic) {

      //arreglo de promesas para la la consulta de los detalles del comic y los personajes de ese comic
      var promises = [];
      promises.push($http({
        method: 'GET',
        url: 'http://gateway.marvel.com/v1/public/comics/'+idComic,
        params: {
          "ts": ts,
          "apikey": keyPublic,
          "hash": hash
        }
      }));

        promises.push( $http({
          method: 'GET',
          url: 'http://gateway.marvel.com/v1/public/comics/'+idComic+'/characters',
          params: {
            "ts": ts,
            "apikey": keyPublic,
            "hash": hash
          }
        }))

      return $q.all(promises);
    }
    return marvelApi;
  })

