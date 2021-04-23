pragma solidity ^0.5.4;

import "./VircleERC20Manager.sol";

// DONOT USE IN PRODUCTION
contract VircleERC20ManagerForTests is VircleERC20Manager {
    using SafeERC20 for VircleERC20I;
    // keyhash or scripthash for vircleWitnessProgram
    function freezeBurnERC20(
        uint value,
        uint32 assetGUID,
        address erc20ContractAddress,
        uint8 precision,
        bytes memory
    )
        public
        minimumValue(erc20ContractAddress, value)
        returns (bool)
    {
        // commented out on purpose
        // require(vircleAddress.length > 0, "vircleAddress cannot be zero");

        // commented out on purpose
        // require(assetGUID > 0, "Asset GUID must not be 0");
        
        assetBalances[assetGUID] = assetBalances[assetGUID].add(value);

        VircleERC20I erc20 = VircleERC20I(erc20ContractAddress);
        require(precision == erc20.decimals(), "Decimals were not provided with the correct value");
        erc20.safeTransferFrom(msg.sender, address(this), value);
        emit TokenFreeze(msg.sender, value, 0);

        return true;
    }
}
