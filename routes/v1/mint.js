const express = require('express'),
	router = express.Router();

const arrayOfEarlyMints = [
	"0xbb1fF00e5Af0f3b81e2F464a329ae4EE7C1DfbA5",
	"0x98c68168474c7EfE22828EaB331Ce98655a8ecc9",
	"0x6E82d74Cd54eFEe0084d8ad0ED1Bd1130c61278F",
	"0xE10BEE357Bb9c29ccc003E63F5553E57c871cE19",
	"0xdbc4c1fA8f4481E32dFF1ADCbC005269279eAAa1",
	"0x0E864D6e3C9Abb9EF05D5C54a848Ca029a749b94",
	"0xbCEF951c175AE6A1fa73ea449EAfED42Aa9e52D6",
	"0x36Ade9BAe1ec913244713A2983Df1b63Cf7C5Ea8",
	"0x436D637E0F602f345f7D7EA6C07fFDdA7D997961",
	"0xc396e98f5302529B10a23D62C99765945Dcb4619",
	"0xF7D941c4584Fc8810df56dD1E74F023908755219",
	"0x00C923a66C2de01Eeb8cC374EA37271d63CB01b9",
	"0x38802A1c483C03bc5f7f8BFe7d789c8f8CDE71c0",
	"0xE8df0A6A2EA754D70F0e089875cd5eD1Ec9AB42b",
	"0xFe7169f7f1f78B12a1AfA3147B793Bb8003C6C57",
	"0x07F0CA2E22D1E18b496C0f5bd9c50F55a73171f3",
	"0x4ac25bf2d1cd447ae75659b90a665cc497991daf",
	"0x1376D82C20Ad860E8d9A3a7389a62974732995ea",
	"0xae702cdc0Ebd5187547f6f7744fb0A9B39120A37",
	"0x27DD8740Ee48F7b90Eb3a07B22F2AFDf73F8BAb6",
	"0x85469C33a26044F7438fb53A5Fe661b678fE8bFd",
	"0xCcE56bE26899d9C3c5372709dfe90621096CC766",
	"0x7E58b013961991c299fE10F48b2361a0000771b9",
	"0x0B364341680cad212700fA5297D161Ec8c7D41Dc",
	"0x573b1a18DdbC1fd79e5FA9946Fb4Ba2809dC8a6B",
	"0x151741b6FeA28Af2e57329B339162B08c81212D1",
	"0xD434276Ad656c193c5E8eF37f211c1ef9628CA44",
	"0x5327871188bA8425B56687AC4a61d74787368AF8",
	"0x62d2301d9F749fa3FA63f31215426785B29B5807",
	"0xeB4c341489129843B325E8e77e05206fCB9DF862",
	"0x75FD2BEA5C16F587565770250d638d967f982953",
	"0xF813ec9C290049B9Aa02e7138736Bb53E12952f3",
	"0xbe13517a2b520b2449068D2ec45280992B04047B",
	"0x8fC645e6a176F07395B8f44196d1443772FE9d57",
	"0x536F181ce2D31C6589A04Bc0f230cC7FB4b41D52",
	"0x0682285b7a990292dd5e6922ba5ecfeb0e0827fb",
	"0x6a7747DE03FdF2a2860f4eE2131FBDa376AA08c1",
	"0x9f469e95a6D62dA5058e2a74DFFeBD63aa1Bd3Ca",
	"0x56484673e48a56f877a8578b7848f45BB13B127C",
	"0x3782CDd35C877478DdA77662d87B333a54f65840",
	"0x1b4Bdf36C4FeE94e2BD7644a206e6DF154185901",
	"0x4Efa859a120a893d4C34637B5d00262e45bdd76b",
	"0x48CaaaD4a87cb3c36A2Cc4EDc2CAbfe03BB2c234",
	"0xeFD67615d66E3819539021d40E155e1a6107F283",
	"0x4cB780Fd3286f2d10199B61423D1c804BD2a5D2B",
	"0x747811193CD339582929344c74E315339Db57446",
	"0x8D5b48934c0C408ADC25F14174c7307922F6Aa60",
	"0x15BF3434f3818647e9648029b3b034a022843460",
	"0x47a3baC03815f462f9f01DFC7Fc8Df23A899f233",
	"0x284F3268d61e07337b6bB461E9994F678b543b10",
	"0xd59c20eFa3fCC5871d6789f725244465BcD6AA0e",
	"0x317AD090e2a44b9cc617c4e8680dBcb61b75b98B",
	"0x7eCc6A96ba48414fa9C31E9964F9c4742eC56AB4",
	"0xf34307036838e2ffB7b785dF7685c2E1b7D1f71C",
	"0x48aC438c8783927eb6BF727655801145AF78D67b",
	"0x0259825C9bD714926F4B43bCF7C052259325936c",
	"0x6260f6db79E51CC131368e72cea6116255408FDc",
	"0x8199e300B66B43bdA467065433f64228Ff9741E2",
	"0x9150BE8dAfB8C03b9f7c2Dd7c7078254fF3CE25E",
	"0xD50CBA9778FbF4beCca53C1d03A3D3D7A59955CF",
	"0x6586684Ad096Ed00C8D5e60b7aAEd88545eFf521",
	"0xEC9c788088725D73d780C578d280CbdE349dCafb",
	"0xdb164F2DB89357A799B91C0edbff3b39bA39C69C",
	"0x9bf4e58E32670c5dB033455EAcC0696a40c67E7D",
	"0xB4fdE51585D3bffb072F3a1ecAc75cca461fD59c",
	"0x798d1F708c21965f0ce37175d57b9C2faD42fD97",
	"0xB01443F921875a80A74c6abF3ab761FE70e4227D",
	"0xee56D7F9dDD4e1130126d3a1bD53390D6330f93c",
	"0x7c5Fdf85910953bdF38788005F323FF69D7D074E",
	"0xA1230741900cb4627469c428E341fF2eA3A825aF",
	"0x816a28F22Cb988d05C69b9346f32D92a5D80C74c",
	"0x9794aFA27FCfAe811E78a9a7422D75849C5d061b",
	"0xf71c7473aea9397e038D037E005e1c4C22Aa6B93",
	"0x88f9782286B8FE9C03A7e3ddae3A006826Fc1Ac8",
	"0xf2720437a8491CBEDa7fc114bebA70378198D70d",
	"0xa0313907508e59550B0d7a48d9A2e36Cec22Da39",
	"0xa4A4556672ACb629e3E3AB625cE758Ec07AcBd25",
	"0x425d040b3bac41CA49C980daCE7a4E332AFe2049",
	"0xE87e4F1516577359297adA62e8A33268B4220CaD",
	"0x5514bF4be6ffe7b7CA1053841127Eb06C4b96F1D",
	"0x12e874169A42b20E15d4BE9d799e6c01E79b48D6",
	"0x6BDa0404288459CdC35B95A0162636088DCCBee8",
	"0xF07B5B44aE0F5066e1E77EFA46c687b13A684cB6",
	"0x30C58E7560e01c78F5997ae5b4A8804b3eb4C8aA",
	"0xc23140E4894881A96EA27AFbDf66d98bb667c417",
	"0xC762B6fd63f4a6C66524819c262F76DcfD4a3821",
	"0x8d6113b8E6BFAd134a70D391a2463471858B9775",
	"0xB123E0f41B1Aa163bf274d0178b22f7f6DBCDdbb",
	"0x70A188889a559FCDb1E7FB964b38f01619A6d784",
	"0xfb0c290918A9D819968c3e2d36609707f48cD601",
	"0xb3E2847971b7151B78D5F8591bd85bB753124B03",
	"0xfbf6ceF07d63FB3c5B185B416D54542d7550F46B",
	"0x0352510ADD4Fd4072d2Aa76fBD9126c31c781900",
	"0x1cE4BD8c10C71Dc5f4c3200b68dBFFbb2C1f155d",
	"0xd4e1b79e446e8019027ad1856b2ad22812c37476",
	"0x929c7677dd34022690e3563D230E9D1539b8900a",
	"0xC85bb09Ebd65166136A0e1c210C14E6B496E41D5",
	"0x6f7A43b6ba633071c5141048Ab4047E258299999",
	"0x797E43cA26B9e651e062AaB874A4A55640Ac7425",
	"0x81Cb12f8eEa9Cad7CfdB4824b7328bD832995Ec3",
	"0xC4bdFEb582a367aB2C0CE6EA38757E63139C30C4",
	"0x8c948d0ff53732CFFD549C9F44A3242b76F4872a",
	"0xc3de2c139613db6e89386d906221e75F44090EFa",
	"0x93DCfFe073FA58E86ce1E20DCc13D29cC887B149",
	"0x4036Fb75984A38F891Ff9377CcE17a918F0e0C7D",
	"0xfb1Eb0694ABE95687a4013AE9651b6e1a4d7f6b2",
	"0x5B28E91bd44945eC073ba1bA2b67e4DE42d4704d",
	"0x5fc4cCEBd0eE2CbFD9dcf44A27CDf8433587a150",
	"0x2bcd4d893d2622c23162fF5a27A20239B10A1619",
	"0x0DE33d82c8890D07a479761557c977c56c666666",
	"0x1CA445228f445Aa5765b0D1D828601946164bEee",
	"0xD52DD5d69Be7F579F7689f6D56f7eB8F547F6130",
	"0xf6093B2518aEe4cada78545149Fe555Fac11E3fD",
	"0xF9A46041FebCc8c49177EBBab1Bef84e5415edfc",
	"0xf3e8Df6fa204016C217FeC76D48b24f101460702",
	"0xfAA4C775CD99017D01b9553cc078EFf6e797c35d",
	"0xFeAaBf9219006571B0C5248f2CedB49B6299E6c3",
	"0xdaabBb932725cC1b3ca487ee174B59CBd6b0eC98",
	"0x1e1B58c774e4e4077608182E1b1F137007888057",
	"0x005E0Bdb76e24056ecA0B6A3ecF18983E5A1d42D",
	"0x23Ac1A629C6fB2f2fadEE290af536996382319e9",
	"0x70710b4f6c4548312C3851aB2d772CEa045AF689",
	"0xd54Edf1C4E67FEf9105B01Fae72474835Adc82f2",
	"0xa4B442Dc6cB61eB9E9A62adbCef92808b3507E82",
	"0x16bcf23DcaC86C827415C5b9Fee3daBF072550Fc",
	"0x3597ED66Ea2a8d6b93d23b15f2fd30D308bF8318",
	"0xe12d5e83441614303772C851040EdDF12f4E1A9E",
	"0x721041F315Ab009895CeC21eBd2fEEf0D949e2F8",
	"0x51106cCc7A9B87A84D10694F0DEa6972452CdA7a",
	"0xAAc21Bb3608D996793E256C0E72305F6a4e2185D",
	"0x0DF80CA23B1Fd9D435D512beCF20FCe902A7Acdf",
	"0x53826F1C76f2AAFac1e856df68e5B6361c098661",
	"0x55Fa7B5D5965e14774A20D9364CBC04dD3833A76",
	"0x314F29f6AD94267B0E4907B8664D45B791e26F0D",
	"0xBecA3A08CFFf0617f2743f953A98B67130e61B0f",
	"0xE118C8661A4a66BE6631c64DD62450D056E7e00a",
	"0x03630a389CeD4b57cCDb7954bDfc656424B6cb66",
	"0xf00f63Fed71D3957a7270C15e5664C950d6Ce708",
	"0xE8cd4cB68dd4c79d118368F36D8564F3134c180D",
	"0x3236CC5181E159f5e14Df57b93F658B96b142ec3",
	"0x657bC123B4f74CbD4Ff5F568a777C8e1DA8D042c",
	"0x292dc888F6bd9f1Af53c4be03D08c02DB1a3414f",
	"0xEA57725972049f80441C46b4f2c44225F2a9e60A",
	"0x461CC40737705B18D708aC21d63687D1cb647e0d",
	"0x8E4cd1c7f40d7f2E0A453bBE4d47F085F893f71a",
	"0x74C80F3a8B93e3c1D43013EA084824d668e6FA1f",
	"0xE834dEFdc52A103CB34E0871555dAE81E1BCd225",
	"0x56691111b943B04062e16eb00761475Feaa7Fff4",
	"0xE5b1918D99f9B5b63817F6C9A7afdA744eF1F647",
	"0xB6a33404dF4958C4f974840AAf427b099EC93366",
	"0x43123a1617D2474F63F60C1C0A9cF2A6D5818a41",
	"0xbC05C664843bb1840e7bCE0590Ccdd7Ce4145369",
	"0x4c00D380942581b8e95a7e7A1DCb2795Cb134d84",
	"0xb62DcAE8E7d22294182fa9eb951479F8090ABbd1",
	"0x26c5dA25790a97B80918ca5267Ebde6bd9298a6C",
	"0xf5172dEc24d1128818DDa0f9B88d3286e1219a49",
	"0xb9832c93b2fD9C1E99Cd44A54CcCa0A8Ec7d7FFf",
	"0x8FFCbCA77572d1Ea0193059690BF5a5978EFa7Be",
	"0xA3d0750295d85E813eB8701D6F323FdEc651518c",
	"0xdc6F534c766D1643377498dC3939874Ea8169163",
	"0xAD2D23dcfF6cDBb8a15e71D9acEF313690933145",
	"0xD87eC9E7058a08BBc9AC932764C78810aB03efcE",
	"0xD81d2DDcb8c609438cc3DeE056F283B0AC03CF1c",
	"0x2E5199b46F1d8f2b9DDc02dB7eDaD90805a82896",
	"0x51D69A3d4a666fb658c22f761b5b87E04Ecf99Ae",
	"0x99b7a16bff3878adb53bc7ddb8e8568744417233",
	"0x8D5b48934c0C408ADC25F14174c7307922F6Aa60",
	"0x4804bB734cB20cCE9279b5Cb0778AFdD346941b4",
	"0xf7eB38d17e6d6b2C12A9Af9F32f6cfCAec6969f3",
	"0x3312C500886b6a473b9f2ff84A5a6b77057034C8",
	"0xe64168faa0043656aEE19012d90cf5182cF635B7",
	"0xD0d8e9331e7F5e47567957ECB8BEDD6933f3Ee6F",
	"0xa972AbeFedA4d790e1eA9f9F453823aCd8CF2E4b",
	"0xeEb9003eDFef21145f5b16E522A31dE1F1b03162",
	"0x7977B909D55a53F9c73140f7F611EaF0638238Ed",
	"0x109A47019ef25FA4020888151A5BF83826a79772",
	"0x65B785e00047636Efa9314c30a2432b4c0B6188B",
	"0x29D844C469745B99daa8979061BB57Eab6Bf54eF",
	"0xd60385568D11870F6e2C12dDe4aCbA7a2600b853",
	"0xdB220DE2d36C5AbF72e1c88ffC29d0AeD06E495e",
	"0xA6C2eac2f893667139b6b89C6B8e6E1950382F53",
	"0x31C4E6deB4F572C77F33eE191E73047c3aCe78d3",
	"0x53aA7EC5EC6cC150fe6cdcF0fddEc50e1F4873C6",
	"0x57D23a76582F30B09106cED93efecf2EF718E187",
	"0x5AEC38191341A5403319B9bbc62A98B77CD45cad",
	"0x3e378E1b220Ab0C959656dfe6549d950514dA68D",
	"0x31968FDe961Ca96f942EC4b3bd4BB21DBea01B6F",
	"0xF340B27d1Ab34F6C3C86b572EB0853bBc5C5bf52",
	"0x231ebe5135007F959A343f58162CC7FAE3edDd0f",
	"0x2AD1B01fFEDb062BcE1374E65d9FBC33BD493fB5",
	"0x85565B3F0e771FA09040404691f81a8c2F9F1226",
	"0x8e97D33405c7498f9025f25e493BB95606961bf9",
	"0x8510ca99a2826792B962e9AB90bc6F5e76ad04F3",
	"0x5E659617C245aBDc57e5082cE1036b333A72159D",
	"0xc4eFF7Bd089A515355B23b0cd79Eb5EF08e6FEFE",
	"0xB2E0a81f67142a67BaF8DC9877E56FD695E5d058",
	"0xf7FfFe10b95197D8Bf5B2A0c6c0ef98229BB7c68",
	"0x1CeAf3e17deCfc2B528D5371aEdc10465C449591",
	"0x3Ec4038339C4817E7aC40C738BD43Df39727D96B",
	"0xA45180f526D325fc6FEe0489c41D0fc29dCCD1be",
	"0xd5ebc84AB66fdfF7403FfAd717dEC3F72391fc74",
	"0x93659dDD36735850713a8c9B5c461760FfE35b82",
	"0x811F493818Ad3f453aECE649F4edb18233e50368",
	"0x5Ef367981bA6FFF30E4Ff0Bf51ad49Da630bB36c",
	"0x0f506485534dC06460659f6Aa4ca7A13E0d758aD",
	"0x987339C64A70f6f32456cB38cD326f5bCbbf9d0b",
	"0x7223F0D5fED49Ee0A8D0d1fcF23c6Ee75e5f2FeD",
	"0x664Ac330f874F3768E93C8511479dE507eac649e",
	"0xd5045483fb08CE80b7B658f54E75527ce626d41C",
	"0xEA7438A9076b31a51b44F1038b91e0362b1E6091",
	"0x53c36e0f5a405d67F2BDdBc777CF7C8E4C3dd178",
	"0xa9Cd17Dc72BB7ad873533954fF489DF0f3195D9F",
	"0x0B40952C623a505dd042e869FE1AA29c09FCbC02",
	"0x9420d14AEA721474f567e7727adAB6cC44C5c424",
	"0xa2f841E329b591C457c243296A9381FaEed8f7Ef",
	"0x5fFDCe83c21820ECDD98DB65D2801e42d74d9f01",
	"0x24dbEac96274A077393e051d6D428dF05Fe8124d",
	"0x01e982CAE54FFc2c0029bD05bDe85e16ff7005d6",
	"0x53aA7EC5EC6cC150fe6cdcF0fddEc50e1F4873C6",
	"0xBc6a1d2bBd8C8B18B9C4DA2b1a7A4d7386FD955A",
	"0xced087cD1F4E6cF769E1E1339A60da8C4e553997",
	"0x320AA6E53AA01fb85DB1dA75C92aD93eAb98419b",
	"0x6511339119eCb0954eA75D45C1b0A9D421b5Af9B",
	"0x281A0eC0A602eB9C9B92a6711941f9D8E93fBB0f",
	"0x718720522eD1bD75407c17146FFAB77960265Fc4",
	"0xb950779E860d8C2F4B102FE5632678e527b94B28",
	"0xdEcF07b35018E15DB7E07F8DC3296f56bEE4306A",
	"0xB13C4878C03374c1019bcFA90f2C87f633F1aa8D",
	"0xc6Cd7cA81698Ed6a6279F51627EaF9298246A270",
	"0x2d6591c4806609CB29cA26aEEf07fDCF4206B20A",
	"0x44C56459A6d384E9A85a3C58b0b58c6a3B5E7Ea9",
	"0x3C7d5bB537AbAe440e0Abe552342F422a4B1e6c1",
	"0xF1a168B5a45f9b402C24639AfE4EA635774feFf0",
	"0x94D3331082d1abc1115Da4f274fFa8DB06f9431e",
	"0xB4722BE8eF84390C9995794aB2Ba71A29d9862a9",
	"0xdbfb629afb08b14c4e959029f5f916bc1f5312bb",
	"0xE19D10aD46736529F4989822dB50Ee0753f6330a",
	"0x78B95584fe82187018eA74eF7A2596036470F50a",
	"0xe8C4BbAeEC2286A7E312217E51d6ADE15BE4f1fd",
	"0xF10f7b2021fb0D0A4b944FbB7183fa3600B2fA75",
	"0x18A842c315C6A8c54d041c65b0aA2732f50c00dA",
	"0x3424387c06918b3487C857D99cB01D06968e71c4",
	"0x8029C4C55aFD6f0E93ec080c5041e7E62e21bCEb",
	"0xe5365507fcf2e967e355a6a6ea9377097ecb37ce",
	"0x76282a2d0371118Ec586C6c203005e090F365cDD",
	"0xd69c056085aB9615006DE618A20FC5616B1cdCD7",
	"0xc9D5d1fEb2E6f0b6fc5fC87a61708164917bcedA",
	"0x80fDa9Ca3E17Df907dDcAD034F452c3F844FF535",
	"0xB26c9b0360231f1AA1cC7336C8f046E2c89F13b4",
	"0xf65d529ae9A804563AD7CDB5278a47b5347c5b4e",
	"0x71C73B951D7A031bb322EBb8c3792F78188FDc4D",
	"0x7cF6Dc2dB031b5c0A869738a682B51890756b24D",
	"0xF2f612a7eF7CD366Ee72CD285eC6a926684d0d1F",
	"0x6A9Df7f165f298d141EC98f41fa88f1eD36b32AB",
	"0xe8D5EE67A69394E721cdF2481f633C37aC70aB91",
	"0x5Ee7e80E0C2CeB690c567acA7761c7118101c8af",
	"0x591ab7f87C0f4F50Bb1bC2984BDF50e892698b26",
	"0x60cAb84421FA8cfeb67fF478481b9e665B6C9A73",
	"0x9000f0850de0195841D2839A05d1718cc02a9085",
	"0xFb8AeeA8EC737eE26a304bFA7B13b76469E4B5f5",
	"0xe5365507fcf2e967e355a6a6ea9377097ecb37ce",
	"0x4Cd89289b0480174e01AbB51586d907cbDB55Ac6",
	"0x1809754df5Ac133A1Cc7d4EaF45ED38cf9b39ec8",
	"0x912B7848C4F5b7bd903d305C5fbd238C7e207e85",
	"0x36B687Bc3433e782dB84A671c5166dE1f02a04C7",
	"0xD716900Fe732839278cD01b373dABdD13AcCBbD0",
	"0x338359fe8950f0bd53de6d1d1e376625f960a8c2",
	"0x5dead1f49F17A4463956A5B6aabd6D96A900337D",
	"0x42a8a900c2fFBDB9b23bAeBC27FD3e5c8B923Fa1",
	"0x600c11d35dd9190151131966ec932800d4f0a66b",
	"0x6cbcc413d2c0a573b94b7c4aeb213deaeb6cb62a",
	"0x48E7E840411EbD92CBc6DeA1304abef6B1AE69F4",
	"0x0095a7cb40d42261cb1b3b7979d70303782c7512",
	"0xA63edCe888DEC91b331c75934b2b7c3F7c3d93B5",
	"0x9E911c004450Fa8bA776e7Bd1F390963d442c983",
	"0x88b0dd43538b300451e688c6fd273f52436d8041",
	"0x074959cacbfd5593a38dc1c450be2b577c60b8f8",
	"0x271575ec8c1c1E08672fB1abec8ef3374551af91",
	"0x3c537d2283f5c155031e024798bc08df9e4b14c6",
	"0x3Ef519a4ab5657f270Ae7acA7Ffd55f1a37fF429",
	"0x5ea0fa9ec290be90A5AdF3E4410aF625836EB12D",
	"0x05f26dc5d89d278c4feae3f423f1ea9b4144c323",
	"0x987a4b12765b0ab296763d7446Bf12b7CdEB1f76",
	"0x6ACFcC1E5133a4a4E397Efdc14b1cd0903cbe1CC",
	"0x82adcfEDd6C7C4aB5ca21b0452A3971A66b141Cd",
	"0x3164ed5B9D37Ac9619aC5895CA33F308aB02a053",
	"0x847Ff39c4D32BCBd7eC724C30DF7C87192A456d5",
	"0x781e8C331234b308777a170FCDd35b22358f4eda",
	"0x957b60afab8050d860A768B2D832C77C0C2262CD",
	"0xDeA9B42b9FF7ff7875462283e3EE0C2cFA2b1ce3",
	"0x027b60a98b4e1Ea3651C7265612EcEBa34338e2C",
	"0xb803F9bAd6cDB7682Fb550d7667d926A6787A7b4",
	"0x7658d986dbD53afa8e042AFd93C3B9033a2a8eaA",
	"0x14f3137b6C53939aa15910c5dEDD0c5959bE16b7",
	"0x8598A5C69551aA13047DB1506c936fCFE266CB1C",
	"0xA61012E1A2F8cE0BaD7296298829416E2d800Bd1",
	"0x1B7b16723771ecd62c59BcAAd9924Cd723D8afe5",
	"0x0b2bBC1c913267a67ac49E3F4F58cb1F8bad7d4E",
	"0x704B1e2DdD7A100cdfD6F9A44De80820745f6638",
	"0xCe1bF4C83FA933fd8a1b88Dd1CdA12Ed849fcC41",
	"0x2474f9Fee7e17709c4feFb94721C9FC69fe5e6B6",
	"0x13F7A78018F28b2227B4c9860cf309716Cd076c6",
	"0xbd2c4f0e2c05b5c4b07ae1991e866a666c0b4831",
	"0x4c32068184c18D8A037F826a9bd49F8164e99E83",
	"0x97900458EC630cE5481f1A0dc82CA94F1867188e",
	"0x07143D3F0e93e70bF170D6758FC296955cc86a76",
	"0x9fc4a41e9f46B73AB4dC7b58E18784c162C044B0",
	"0xBE76Db08C6890E0a27F15C9dEed9886a908a4f6f",
	"0xf28587309Fe4dF2c77fA8217CFdD13160f83B2b6",
	"0xd9079f124D43c83ee00dedD9005E21ccF47607b5",
	"0xF63185A8B305576f4EAf6CfcC9a9217cc477F2Ca",
	"0xcecB90d48fb662958b252159137eeF2F9C9EDEd6",
	"0x3Ca76f8156f7D09F2da91739C71c1735aE762770",
	"0x494BB457B0DfBD9A9F6943597e4F3D4E57bb1FD2",
	"0x99af1efAcf378e680652e16aEC64cec252e729B1",
	"0xAc51Ec748318DCDD590F5960a802602f8569729F",
	"0xc6b2d4f463aD39a0dEa8C78Bb3E2676cDD89062C",
	"0x36Ade9BAe1ec913244713A2983Df1b63Cf7C5Ea8",
	"0xD9941D6217F7072D968fDDB5c5F7C9046B0fFa6b",
	"0x6A690b9b766B6039495fF2d993664c052128d0c0",
	"0x1aE645D5f1eb7545fb17ee09bca77747cd2ae028",
	"0x17369D094C735225f1a36813Cb1298170F28c129",
	"0x29e15791cA4f1c6110240Fb3F01f779176b0E001",
	"0x995A9d9907b0AfAB92291ec8cBF349E0AA5c4abd",
	"0x8A5C86c9327846d32240be4b7c7611130Bc3459a",
	"0x6723CC443f8AfDD80446BCf62d10AA9a1a6E4d6b",
	"0x6E1546a885304F2152A3b2cE36598Eb555c0577E",
	"0xD91Eb609E48b2Ae6C914C28Ef55083a64C290358",
	"0x2AC6f6702F5D685a69258283DB04b8BF8494f58C",
	"0xd4Fd0B1e7d2cA17B72813F406e3f211188326A9C",
	"0x4660fBB1E7C72AbDdCf4d90B244887e3521AD3b2",
	"0x330AA0a042347313B68Be4CB629323488CF19D20",
	"0x17ceDdA24ce320f5A9Eb1d1223F92EDad5294eFe",
	"0x9664D427C13B0a5DA33e0ff618d995e29cAB5e53",
	"0x975F1Be5Fbd4aB7A9B77B6dc32FEa6F4E26908ad",
	"0x3CcaE907D08D49BaaE8dFd7AFE4aFAE3d21de037",
	"0xF42FB4642fBEE545e2DD7f6aA09D3D79751925D3",
	"0xB3A251c592ecDac80ad041A5449402d328F7bCA2",
	"0x47C233C3134576c12204E0B8B9e5A10BD7036cA5",
	"0x4978a0ad290B630Af892f9fd069e04d92AFf170c",
	"0xa3E40b15F30A4A3D73C1d8435EE25041b05D1daA",
	"0x2a33ccf95e7520c127abe2a07743b82c2b942596",
	"0x14e63Ebf08494c7b2f9934Ec9deC6154D529d033",
	"0xf1aAcF8B995Ae350366430Ab1f9a86aF8cb52587",
	"0x6ebf331b50381dfa87af6b451751351c91e0879a",
	"0x83c1baf7de0f9846f0fac84fab2b3242e43c25a7",
	"0xf850896DdB41f892d1a00f7e83d9C821155519E2",
	"0xe5e10cB4E0D26DEe925b9C157CE81075C07670c4",
	"0X98F57A7B2B2BE7067ABEB1ED956F14886184E5C3",
	"0x3E603c22435AeCec8902ff34809fdE8E69265F25",
	"0x64944c307fd98134bCA50c8ed88D3831a8b3131a",
	"0x2A795aE6A556D159A826B57D58F1381F74CD9f2e",
	"0x3DD602116FA2E5FED2517122e226707E6620aC27",
	"0xF358D61a6b6FB971cEb51987Acc8D9aE7f9dBa1C",
	"0x6b3F5fBa9E8eD5CB48a9a0aAF0ED5f9dB9509Be6",
	"0xC9c4b79bee62649d91E70F7082FF07E7Dd4ac0C9",
	"0x5A6da46839Fe767C8a481a735Af978baa5576944",
	"0x1a94578c4db2C90042c62FB0311FE1423659475b",
	"0xd4FB0C1E6086fAAe50b9b03F9b5a5965320AD35c",
	"0x535a8757d22668Ad76D3A3e73ba3D5F411174709",
	"0x4f4dB628a1A3ea3F64968849C66549558A700Ae8",
	"0xEB6Bf6ea9C90d2fD7f8d7d4003745B1a09E30E25",
	"0x91bf6268D9b90e49E47E59572fd01b7B218eF97f",
	"0x1d01e2010C7018AA9A10Ee81bEb8e88F212a1209",
	"0xA06811CCA932ef48D86bb893E46e58740f03de5A",
	"0x4DbFe38B13BB7ab7cddBa81031b159Ce44993c1e",
	"0xFA9c651036967bb964105e155B0e34798480b66b",
	"0x67d27E30dF95A219beDC7FEa5Cdc945C96938a06",
	"0x77811b6c55751E28522e3De940ABF1a7F3040235",
	"0xddfc7342031112A4f73d462a9C39A646fdD53C42",
	"0x81a1B8ED2D0449a50168C6B410a4De24CebB9f70",
	"0x167fDEDF7a968845A05BE9082163D151aA62A354",
	"0xF23d286a79CF498e96cb80E19dC10Ae565eaAF3c",
	"0x778AA430b66CC330Ac4584D7f76baA3d2645DbA7",
	"0xBe2a8857865391dA155C1CdE0737Fe3A90F63cc2",
	"0xB1E62cf6651B3368e45275400f12F2883FE0B07C",
	"0xEb621040688B39DC8cc794d3621C54a488C5DC41",
	"0xD13aD24B3AB7977Bf7450BdB2288ea62b3f21B43",
	"0x696E7128118C9290b4a27f07de2654a8BA3dd1E1",
	"0x725Fc8fE91DcF9343DD80342A93E45F2923c7334",
	"0xCdD27fDF1B991E9DEB8647EE3D8Ac1bdB7D6b675",
	"0x2b333AE41632c0266AE275e811bB5EeB3F21fd03",
	"0x5aede59255e77ccfab97fde9e4e914921fb245fa",
	"0x1F3A0dd591B51Ae6a67415E147c7a25437B54501",
	"0xB5cC3308C8E0F12fCCCa72e0fA3C8C20518c11e7",
	"0x380EF0a3d6a9D00d623209FE130a1db08D27572D",
	"0xD53154375a02b303e44d4D04e5a4dE1ba6eB873c",
	"0x49a687a71C379f5c5EF4E28171ada117F2C0A29e",
	"0x35f80420bbDB358b6bf274038aeD03B49235E9fC",//adding myself for testing purposes
]

router.get("/status", (req, res) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			errors: [],
			live: false
		},
		statusCode = 400;
	
	try{
		const {wa:address} = req.query;
		rj.ok = true;
		// const tsMintLiveInMs = 1647814380000,
		const tsMintLiveInMs = 1647814980000,
			tsEarlyOGMintLiveInMs = tsMintLiveInMs - (5 * 60 * 1000);//5 minute head start;
			// tsEarlyOGMintLiveInMs = tsMintLiveInMs - (3 * 24 * 60 * 60 * 1000);//3 days for testing purposes
		// const tsMintLiveInMs = 10;
		console.info(`${loggingTag} user is early? ${arrayOfEarlyMints.indexOf(address) > -1}`)
		rj.live = new Date().getTime() > (arrayOfEarlyMints.indexOf(address) > -1 ? tsEarlyOGMintLiveInMs : tsMintLiveInMs);
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	res.status(statusCode).json(rj).end();
});

module.exports = router;