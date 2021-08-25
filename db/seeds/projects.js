
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('project').del()
    .then(function () {
      // Inserts seed entries
      return knex('project').insert([
        {
          nama_project: 'Fighting',
          creator: 'Ahmad Muaz',
          description: 'Menceritakan pertarungan antara manusia dengan zombie, tetapi saat pertarungan berlangsung zombie pun datang terlambat dan terjadilah perkelahian.',
          project_link: 'https://if.paramadina.ac.id/repo/animasi/fighting.mp4',
          type: 'animasi'
        },
        {
          nama_project: 'Quiet Place',
          creator: 'Muhammad Al Ghifari',
          description: 'Serangan alien yang begitu masif menginvasi planet dan menghancurkannya, hanya beberapa orang yang selamat, tetapi ancaman alien selalu mengintai di semua sisi.',
          project_link: 'https://if.paramadina.ac.id/repo/animasi/quiet_place.mp4',
          type: 'animasi'
        },
        {
          nama_project: 'Rocket To Mars',
          creator: 'Dwi M Nofan',
          description: 'Proses peluncuran roket menuju mars, merupakan salah satu kehebatan manusia dalam kemajuan bidang teknologi, pengambilan kamera pun sangat sinematik.',
          project_link: 'https://if.paramadina.ac.id/repo/animasi/rocket_to_mars.mp4',
          type: 'animasi'
        },
        {
          nama_project: 'Creepy House',
          creator: 'Talitha Syahla Janiar Arifin',
          description: 'Suatu hari Atha bersama temannya sedang camping, tetapi terdengar suara aneh yang asalnya dari rumah dekat perkemahannya. Lalu...',
          project_link: 'https://if.paramadina.ac.id/repo/animasi/horor_game.mp4',
          type: 'animasi'
        },
        {
          nama_project: 'Battledance',
          creator: 'Nakia Natassa',
          description: 'Di suatu jalanan, beberapa anak muda sedang mempertunjukkan kelebihannya dalam menari, mereka saling membalas satu sama lainnya.',
          project_link: 'https://if.paramadina.ac.id/repo/animasi/battle_dance.mp4',
          type: 'animasi'
        },
        {
          nama_project: 'Horror Hospital',
          creator: 'Dinda Khoirunnisa',
          description: 'Si panjul kaget saat keluar dari toilet, ia bertemu dengan Jomjom yang sedang maem, tak lama kemudian si panjul panik dan berlari sekencang mungkin, tak lama setelah Jomjom makan ia mengejar si panjul.',
          project_link: 'https://if.paramadina.ac.id/repo/animasi/horror.mp4',
          type: 'animasi'
        },
        {
          nama_project: 'Monster Joget',
          creator: 'Lia Suci Rahmania',
          description: 'Joget joget',
          project_link: 'https://if.paramadina.ac.id/repo/animasi/lia.mp4',
          type: 'animasi'
        },
        {
          nama_project: 'Curut',
          creator: 'Muhammad Al Ghifari',
          project_link: 'https://if.paramadina.ac.id/repo/game/curut/',
          type: 'game'
        },
        {
          nama_project: 'Astronot',
          creator: 'Dwi M Nofan',
          project_link: 'https://if.paramadina.ac.id/repo/game/astronot/',
          type: 'game'
        },
        {
          nama_project: 'Dragon',
          creator: 'Nakia Natassa',
          project_link: 'https://if.paramadina.ac.id/repo/game/dragon/',
          type: 'game'
        },
        {
          nama_project: 'UFO',
          creator: 'Ahmad Muaz',
          project_link: 'https://if.paramadina.ac.id/repo/game/ufo/',
          type: 'game'
        },
        {
          nama_project: 'Pukul Bola',
          creator: 'Wulan Sari Gumilang',
          project_link: 'https://if.paramadina.ac.id/repo/game/pukulbola/',
          type: 'game'
        },
      ]);
    })
    .catch(e => console.error("error " + e));
};
