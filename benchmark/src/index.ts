import classic from './classic';
import effjsonServer from './effjson-server';

if (process.env.flavor === 'classic') {
  classic.listen(8080, () => console.log('Classic listening...'));
} else {
  effjsonServer.listen(8080, () => console.log('EffJson listening...'));
}
