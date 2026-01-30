const data = {
  content: [
    {
      id: 1,
      title: 'FORMS',
      cards: [
        {
          id: 1,
          title: 'Tai Chi form1',
          type: 'img',
          src: 'https://managefiles.s3.amazonaws.com/media/274934715_10222570831513048_628760115811098736_n_3Zrz5GP.jpg',
          color: 'primary'
        },
        {
          id: 2,
          title: 'test color rank',
          type: 'img',
          src: 'https://managefiles.s3.amazonaws.com/media/rock_l4GJG78.jpg',
          color: 'error'
        },
        {
          id: 3,
          title: 'ATA form',
          type: 'img',
          src: 'https://managefiles.s3.amazonaws.com/media/rock_l4GJG78.jpg',
          color: 'warning'
        }
      ]
    },
    {
      id: 2,
      title: 'WEAPONS',
      cards: [
        {
          id: 1,
          title: 'Saber Form',
          type: 'img',
          src: 'https://managefiles.s3.amazonaws.com/media/274934715_10222570831513048_628760115811098736_n_3Zrz5GP.jpg',
          color: 'success'
        },
        {
          id: 2,
          title: 'Video',
          type: 'img',
          src: 'https://managefiles.s3.amazonaws.com/media/rock_l4GJG78.jpg',
          color: 'secondary'
        }
      ]
    }
  ]
}

export const getStudyContent = () => {
  return data
}
