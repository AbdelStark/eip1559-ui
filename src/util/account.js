export function accountsToSelectPrivateKeyOptions(accounts) {
    const accountOptions = [];
    if (accounts != null) {
        accounts.forEach(account => {
            accountOptions.push({
                value: account.privateKey,
                text: account.address,
            });
        });
    }
    return accountOptions;
}

export function accountsToSelectAddressOptions(accounts) {
    const accountOptions = [];
    if (accounts != null) {
        accounts.forEach(account => {
            accountOptions.push({
                value: account.address,
                text: account.address,
            });
        });
    }
    return accountOptions;
}