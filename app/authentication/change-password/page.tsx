import ChangePwd from '@/components/User/change-pwd';
import { ProvidersAuth } from '@/providers/session';

function ChangePwdPage() {
  return (
    <ProvidersAuth>
      <ChangePwd />
    </ProvidersAuth>
  );
}

export default ChangePwdPage;
