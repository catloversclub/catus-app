import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const PrivacyPolicy = () => {
  return (
    <ScrollView
      className="flex-1 bg-semantic-bg-primary"
      contentContainerClassName="py-10 px-5 gap-6 flex-col"
    >
      <Text className="typo-title2 text-semantic-text-primary">
        CatUs 개인정보 처리방침
      </Text>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제1조 (개인정보 처리 목적)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          CatUs(이하 “서비스”)는 다음의 목적을 위하여 개인정보를 처리합니다.
          {"\n"} · 회원 가입 및 관리 {"\n"} · 서비스 제공 및 운영 {"\n"} ·
          이용자 문의 대응 및 고객 지원 {"\n"} ·서비스 개선 및 통계 분석
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제2조 (수집하는 개인정보 항목)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          1. 회원가입 시{"\n"} · 필수: 이메일, 비밀번호, 닉네임 {"\n"} · 선택:
          프로필 이미지 {"\n"}2. 서비스 이용 과정에서 자동 수집 {"\n"} · 접속 IP
          주소 {"\n"} · 기기 정보 (OS, 앱 버전 등) {"\n"} · 이용 기록 (접속
          로그, 활동 내역 등)
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제3조 (개인정보의 보유 및 이용기간)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          1. 회원 탈퇴 시 개인정보는 지체 없이 삭제합니다. {"\n"}2. 단, 다음의
          경우 일정 기간 보관할 수 있습니다. {"\n"} · 관련 법령에 따른 보관
          의무가 있는 경우 {"\n"} · 서비스 부정 이용 방지를 위한 기록
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제4조 (개인정보의 제3자 제공)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
          {"\n"}다만, 다음의 경우는 예외로 합니다. {"\n"} · 이용자의 사전 동의를
          받은 경우 {"\n"} · 법령에 의해 요구되는 경우
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제5조 (개인정보 처리의 위탁)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          서비스는 원활한 운영을 위해 일부 업무를 외부에 위탁할 수 있습니다.
          {"\n"}이 경우 개인정보가 안전하게 처리되도록 필요한 사항을
          관리·감독합니다.
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제6조 (이용자의 권리 및 행사 방법)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          1. 이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다.
          {"\n"}2. 개인정보 관련 문의는 서비스 내 문의 기능을 통해 요청할 수
          있습니다.
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제7조 (개인정보의 안전성 확보 조치)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          서비스는 개인정보 보호를 위해 다음과 같은 조치를 취합니다. {"\n"} ·
          비밀번호 암호화 저장 {"\n"} · 접근 권한 최소화 {"\n"} · 보안 시스템
          운영
        </Text>
      </View>
      <View className="flex-col gap-2.5">
        <Text className="typo-title3 text-semantic-text-primary">
          제9조 (개인정보처리방침 변경)
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary">
          본 방침은 변경될 수 있으며, 변경 시 사전에 공지합니다.
        </Text>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;
